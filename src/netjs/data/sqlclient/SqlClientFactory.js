netjs.data.sqlclient.SqlClientFactory = (function (netjs) {

    var SqlClientFactory = function () {
        var _args;

        /**
         * Call the parent constructor
         */
        _args = Array.prototype.slice.call(arguments);
        SqlClientFactory._parent.constructor.apply(this, _args);

        if(!SqlClientFactory._isBase){
            return netjs.Util.proxy(this);
        } else {
            return this;
        }
    };

    SqlClientFactory.inheritsFrom(netjs.Class).isType('SqlClientFactory');

    SqlClientFactory.prototype.createCommand = function () {
        throw new netjs.NotImplementedException('createCommand is yet to be implemented.');
    };

    SqlClientFactory.prototype.createCommandBuilder = function () {
        throw new netjs.NotImplementedException('createCommandBuilder is yet to be implemented.');
    };

    SqlClientFactory.prototype.createConnection = function () {
        return new netjs.data.sqlclient.SqlConnection();
    };

    SqlClientFactory.prototype.createConnectionStringBuilder = function () {
        throw new netjs.NotImplementedException('createConnectionStringBuilder is yet to be implemented.');
    };

    SqlClientFactory._instance = SqlClientFactory._instance || new SqlClientFactory();

    return SqlClientFactory._instance;

} (netjs));
