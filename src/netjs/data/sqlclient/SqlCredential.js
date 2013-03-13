netjs.data.sqlclient.SqlCredential = (function (ntejs) {

    var SqlCredential = function (userId, password) {
        var _args;

        /**
         * Call the parent constructor
         */
        _args = Array.prototype.slice.call(arguments);
        SqlCredential._parent.constructor.apply(this, _args);

        this._userId = userId || null;

        this._password = password || null;

        if(!SqlCredential._isBase){
            return netjs.Util.proxy(this);
        } else {
            return this;
        }
    };

    SqlCredential.inheritsFrom(netjs.Class).isType('SqlCredential');

    SqlCredential.prototype.getPassword = function () {
        var self = this;
        return self._password;
    };

    SqlCredential.prototype.getUserId = function () {
        var self = this;
        return self._userId;
    };

    return SqlCredential;

} (netjs));