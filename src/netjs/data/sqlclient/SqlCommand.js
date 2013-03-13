netjs.data.sqlclient.SqlCommand = (function ($) {

    var SqlCommand = function (cmdText, connection, transaction) {
        /**
         * Call the parent constructor
         */
        var _args = Array.prototype.slice.call(arguments);
        SqlCommand._parent.constructor.apply(this, _args);

        this._cmdText = cmdText || null;
        this._connection = connection || null;
        this._transaction = transaction | null;
        this._cmdTimeOut = 15;

        if(!SqlCommand._isBase){
            return netjs.Util.proxy(this);
        } else {
            return this;
        }
    };

    SqlCommand.inheritsFrom(netjs.data.common.DbCommand).isType('SqlCommand');

    SqlCommand.prototype.getCommandText = function () {
        var self = this;
        return self._cmdText;
    };

    SqlCommand.prototype.setCommandText = function (text){
        var self = this;
        self._cmdText = text;
    };

    SqlCommand.prototype.getCommandTimeout = function () {
        var self = this;
        return self._cmdTimeOut;
    };

    SqlCommand.prototype.setCommandTimeout = function (timeOut) {
        var self = this;
        self._cmdTimeOut = timeOut ;
    };

    SqlCommand.prototype.getCommandType = netjs.Abstract.abstractMethod;

    SqlCommand.prototype.setCommandType = netjs.Abstract.abstractMethod;

    SqlCommand.prototype.getConnection = function () {
        var self = this;
        return self._connection;
    };

    SqlCommand.prototype.setConnection = netjs.Abstract.abstractMethod;

    SqlCommand.prototype.getTransaction = netjs.Abstract.abstractMethod;

    SqlCommand.prototype.setTransaction = netjs.Abstract.abstractMethod;

    SqlCommand.prototype.cancel = netjs.Abstract.abstractMethod;

    SqlCommand.prototype.executeNonQueryAsync = netjs.Abstract.abstractMethod;

    SqlCommand.prototype.executeReaderAsync = function () {
        //TODO for now return underlying result set
        //TODO later, return a data reader built from the result set
        var self = this, def;
        def = $.Deferred(function (){
            try{
                //use queryRaw to get meta-data need for future reader data
                self._connection._currentConnection.queryRaw(self._cmdText, function(err, results){
                    if(!_.isUndefined(err) ){
                        throw new netjs.SystemException('There was an error executing the query: ' + err);
                    } else {
                        def.resolve(results);
                    }
                });
            } catch (err){
                def.reject(err);
            }
        });
        return def.promise();
    };

    SqlCommand.prototype.executeScalarAsync = netjs.Abstract.abstractMethod;

    SqlCommand.prototype.dispose = netjs.Abstract.abstractMethod;

    SqlCommand.ensureImplements(netjs.data.IDbCommand, netjs.IDisposable);

    return SqlCommand;
} (jQuery));
