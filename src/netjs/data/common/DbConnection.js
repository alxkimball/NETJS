netjs.data.common.DbConnection = (function (netjs) {

    /*
    * Initializes a new instance of the DbConnection class.
    * */
    var DbConnection = function () {
        // use _isBase to determine if this constructor is being invoked via chain or new
        if(!DbConnection._isBase){
            throw new Error("Can't instantiate abstract classes");
        } else {
            /**
             * Call the parent constructor
             */
            var _args = Array.prototype.slice.call(arguments);
            DbConnection._parent.constructor.apply(this, _args);
        }

        if(!DbConnection._isBase){
            return netjs.Util.proxy(this);
        } else {
            return this;
        }
    };

    DbConnection.inheritsFrom(netjs.Class).isType('DbConnection');

    /*
    * Gets the DbProviderFactory for this DbConnection.
    * */
    DbConnection.prototype.getProviderFactory = netjs.Abstract.abstractMethod;

    /*
    * Gets the string used to open the connection.
    * */
    DbConnection.prototype.getConnectionString = netjs.Abstract.abstractMethod;

    /*
    * Sets the string used to open the connection.
    * */
    DbConnection.prototype.setConnectionString = netjs.Abstract.abstractMethod;

    /*
    * The time (in seconds) to wait for a connection to open.
    * The default value is determined by the specific type of connection that you are using.
    * */
    DbConnection.prototype.getConnectionTimeout = netjs.Abstract.abstractMethod;

    /*
    * Gets the name of the current database after a connection is opened,
    * or the database name specified in the connection string before the connection is opened.
    * */
    DbConnection.prototype.getDatabase = netjs.Abstract.abstractMethod;

    /*
    * Gets a string that describes the state of the connection.
    * */
    DbConnection.prototype.getState = netjs.Abstract.abstractMethod;

    /*
    * Gets the name of the database server to which to connect.
    * */
    DbConnection.prototype.getDataSource = netjs.Abstract.abstractMethod;

    /*
    * Gets a string that represents the version of the server to which the object is connected.
    * */
    DbConnection.prototype.getServerVersion = netjs.Abstract.abstractMethod;

    /*
    * Starts a database transaction.
    * */
    DbConnection.prototype.beginTransaction = netjs.Abstract.abstractMethod;

    /*
    * Changes the current database for an open connection.
    * */
    DbConnection.prototype.changeDatabase = netjs.Abstract.abstractMethod;

    /*
    * Closes the connection to the database. This is the preferred method of closing any open connection.
    * */
    DbConnection.prototype.close = netjs.Abstract.abstractMethod;

    /*
    * Creates and returns a DbCommand object associated with the current connection.
    * */
    DbConnection.prototype.createCommand = netjs.Abstract.abstractMethod;

    /*
    * Opens a database connection synchronously with the settings specified by the ConnectionString.
    * */
    DbConnection.prototype.open = netjs.Abstract.abstractMethod;

    /*
    * An asynchronous version of Open, which opens a database connection with the settings specified by
    * the ConnectionString.  Returns jQuery.promise object.
    **/
    DbConnection.prototype.openAsync = netjs.Abstract.abstractMethod;

    /*
    * Releases all resources used by the Component. (Inherited from Component.)
    * */
    DbConnection.prototype.dispose = netjs.Abstract.abstractMethod;

    DbConnection.ensureImplements(netjs.data.IDbConnection, netjs.IDisposable);

    return DbConnection;

} (netjs));
