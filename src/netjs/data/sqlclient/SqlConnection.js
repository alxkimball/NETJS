netjs.data.sqlclient.SqlConnection = (function (config, netjs, _, SqlTransaction) {

    var SqlConnection = function (connectionString, sqlCredential) {
        var _args;

        /**
         * Call the parent constructor
         */
        _args = Array.prototype.slice.call(arguments);
        SqlConnection._parent.constructor.apply(this, _args);

        this._connectionString = SqlConnection._isConnectionStringValid(connectionString) ? connectionString : null;
        this._state = netjs.data.ConnectionState.Closed;
        this._server = null;
        this._database = null;
        this._serverVersion = null;

        this._sqlCredential = sqlCredential || null;
        this._currentConnection = null;

        //TODO Return un-proxied object until protected mechanism can be achieved.
        //The command will need access to the underlying connection object.
        return this;
        /*if(!SqlConnection._isBase){
            return netjs.Util.proxy(this);
        } else {
            return this;
        }*/
    };

    SqlConnection.inheritsFrom(netjs.data.common.DbConnection).isType('SqlConnection');

    /*
     * Gets the DbProviderFactory for this SqlConnection.
     * */
    SqlConnection.prototype.getProviderFactory = function () {
        return netjs.data.sqlclient.SqlClientFactory;
    };

    /*
     * Gets the string used to open the connection.
     * */
    SqlConnection.prototype.getConnectionString = function () {
        var self = this;
        return self._connectionString;
    };

    /*
     * Sets the string used to open the connection.
     * */
    SqlConnection.prototype.setConnectionString = function (connectionString) {
        var self = this;
        if(self._isConnectionStringValid(connectionString)){
            self._connectionString = connectionString;
        } else {
            throw new netjs.ArgumentException('The supplied connectionString is invalid.');
        }
    };

    /*
     * The time (in seconds) to wait for a connection to open. The default value is 15 seconds.
     * */
    SqlConnection.prototype.getConnectionTimeout = function () {
        return 15;
    };

    /*
     * Gets the name of the current database after a connection is opened,
     * or the database name specified in the connection string before the connection is opened.
     * */
    SqlConnection.prototype.getDatabase = function () {
        var self = this;
        return self._database;
    };

    /*
     * Gets a string that describes the state of the connection.
     * */
    SqlConnection.prototype.getState = function () {
        var self = this;
        return self._state.valueOf();
    };

    /*
     * Gets the name of the database server to which to connect.
     * */
    SqlConnection.prototype.getDataSource = function () {
        var self = this;
        return self._server;
    };

    /*
     * Gets a string that represents the version of the server to which the object is connected.
     * */
    SqlConnection.prototype.getServerVersion = function () {
        var self = this;
        return self._serverVersion;
    };

    /*
     * Starts a database transaction.
     * */
    SqlConnection.prototype.beginTransaction = netjs.Abstract.abstractMethod;

    /*
     * Changes the current database for an open connection.
     * */
    SqlConnection.prototype.changeDatabase = function (database) {
        var self = this;
        if(_.isNull(database) || database.length < 1){
            throw new netjs.ArgumentException('The database name is not valid.')
        }
        if(self._state === netjs.data.ConnectionState.Open){
            throw new netjs.InvalidOperationException('The connection is not open.')
        }

        //TODO close the current connection, modstring, open on moded string
        self._database = database;
    };

    /*
     * Closes the connection to the database. This is the preferred method of closing any open connection.
     * */
    SqlConnection.prototype.close = function ( ){
        var self = this;
        if(!_.isUndefined(self._currentConnection) && !_.isNull(self._currentConnection)){
            self._currentConnection.close();
            self._state = netjs.data.ConnectionState.Closed;
        }
    };

    /*
     * Creates and returns a DbCommand object associated with the current connection.
     * */
    SqlConnection.prototype.createCommand = function () {
        var self = this, cmd;
        //create a SqlCommand associated with this connection
        //the command text is set to null to get defaults
        cmd = new netjs.data.sqlclient.SqlCommand(null, self);
        return cmd;
    };

    /*
     * An asynchronous version of Open, which opens a database connection with the settings specified by
     * the ConnectionString.  Returns jQuery.promise object.
     **/
    SqlConnection.prototype.openAsync = function () {
        var self = this;
        if(self._state === netjs.data.ConnectionState.Open){
            throw new netjs.InvalidOperationException('The connection is already open.');
        }
        if(SqlConnection._isConnectionStringValid(self._connectionString)){
            //get the sql connection provider node module
            var _sql = config.sqlclient_provider;
            self._state = netjs.data.ConnectionState.Connecting;
            var def = jQuery.Deferred(function () {
                _sql.open(self._connectionString, function(error, connection){
                    if(_.isUndefined(error) || _.isNull(error)){
                        self._currentConnection = connection;
                        self._state = netjs.data.ConnectionState.Open;
                        def.resolve();
                    } else {
                        def.reject();
                        self._state = netjs.data.ConnectionState.Broken;
                        throw new netjs.data.sqlclient.SqlException('The underlying provider failed to open ')
                    }
                });
            });
            return def.promise();
        } else {
            throw new
                netjs.InvalidOperationException('Cannot open a connection without specifying a data source or server.');
        }
    };

    /*
     * Releases all resources used by the Component. (Inherited from Component.)
     * */
    SqlConnection.prototype.dispose = function () {
        var self = this;
        try {
            self.close();
        } catch (err){
            //TODO do something intelligent.
        }
    };

    SqlConnection.prototype.getCredential = function () {
        var self = this;
        return self._sqlCredential;
    };

    SqlConnection.prototype.setCredential = function (sqlCredential) {
        var self = this;
        self._sqlCredential = sqlCredential;
    };

    SqlConnection._isConnectionStringValid = function (connectionString) {
        if(_.isUndefined(connectionString)
            || _.isNull(connectionString)
            || connectionString.length < 1){
            return false;
        }
        //TODO use regex to parse the string into key/values pairs and then
        //determine if there are a minimum set to attempt a connection
        return true;
    };

    return SqlConnection;

} (config, netjs, _, (function (){
    var SqlTransaction = function (connection) {
        //can't construct except through connection.beginTransaction
    };

    SqlTransaction.inheritsFrom(netjs.data.common.DbTransaction).isType('SqlTransaction');

    SqlTransaction.prototype.commit = netjs.Abstract.abstractMethod;

    SqlTransaction.prototype.rollback = netjs.Abstract.abstractMethod;

    SqlTransaction.prototype.dispose = netjs.Abstract.abstractMethod;

    SqlTransaction.ensureImplements(netjs.data.IDbTransaction);

    return SqlTransaction;
} ())));
