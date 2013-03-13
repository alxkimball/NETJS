netjs.Exception = (function (netjs) {

    var Exception = function (message, innerException) {
        var _args;

        /**
         * Call the parent constructor
         */
        _args = Array.prototype.slice.call(arguments);
        Exception._parent.constructor.apply(this, _args);

        this._message = message;
        this._innerException = innerException;
        this._data = new netjs.collections.Hashtable();
        this._source = null;

        if(!Exception._isBase){
            return netjs.Util.proxy(this);
        } else {
            return this;
        }
    };

    Exception.inheritsFrom(netjs.Class).isType('Exception');

    Exception.prototype.getInnerException = function () {
        var self = this;
        return self._innerException;
    };

    Exception.prototype.getMessage = function () {
        var self = this;
        return self._message;
    };

    Exception.prototype.getData = function () {
        var self = this;
        return self._data;
    };

    Exception.prototype.getSource = function () {
        var self = this;
        return self._source;
    };

    Exception.prototype.setSource = function (source) {
        var self = this;
        self._source = source;
    };

    return Exception;

} (netjs));
