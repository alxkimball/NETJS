netjs.data.common.DbCommand = (function (netjs) {

    var DbCommand = function () {
        // use _isBase to determine if this constructor is being invoked via chain or new
        if(!DbCommand._isBase){
            throw new Error("Can't instantiate abstract classes");
        } else {
            /**
             * Call the parent constructor
             */
            var _args = Array.prototype.slice.call(arguments);
            DbCommand._parent.constructor.apply(this, _args);
        }

        if(!DbCommand._isBase){
            return netjs.Util.proxy(this);
        } else {
            return this;
        }
    };

    DbCommand.inheritsFrom(netjs.Class).isType('DbCommand');

    DbCommand.prototype.getCommandText = netjs.Abstract.abstractMethod;

    /*
    * Gets the wait time before terminating the attempt to execute a command and generating an error.
    * */
    DbCommand.prototype.setCommandText = netjs.Abstract.abstractMethod;

    /*
    * Gets the wait time before terminating the attempt to execute a command and generating an error.
    * */
    DbCommand.prototype.getCommandTimeout = netjs.Abstract.abstractMethod;

    DbCommand.prototype.setCommandTimeout = netjs.Abstract.abstractMethod;

    DbCommand.prototype.getCommandType = netjs.Abstract.abstractMethod;

    DbCommand.prototype.setCommandType = netjs.Abstract.abstractMethod;

    DbCommand.prototype.getConnection = netjs.Abstract.abstractMethod;

    DbCommand.prototype.setConnection = netjs.Abstract.abstractMethod;

    DbCommand.prototype.getTransaction = netjs.Abstract.abstractMethod;

    DbCommand.prototype.setTransaction = netjs.Abstract.abstractMethod;

    DbCommand.prototype.cancel = netjs.Abstract.abstractMethod;

    DbCommand.prototype.executeNonQueryAsync = netjs.Abstract.abstractMethod;

    DbCommand.prototype.executeReaderAsync = netjs.Abstract.abstractMethod;

    DbCommand.prototype.executeScalarAsync = netjs.Abstract.abstractMethod;

    DbCommand.prototype.dispose = netjs.Abstract.abstractMethod;

    DbCommand.ensureImplements(netjs.data.IDbCommand, netjs.IDisposable);

    return DbCommand;

} (netjs));
