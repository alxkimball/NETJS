netjs.data.common.DbTransaction = (function (netjs) {

    var DbTransaction = function () {
        // use _isBase to determine if this constructor is being invoked via chain or new
        if(!DbTransaction._isBase){
            throw new Error("Can't instantiate abstract classes");
        } else {
            /**
             * Call the parent constructor
             */
            var _args = Array.prototype.slice.call(arguments);
            DbTransaction._parent.constructor.apply(this, _args);
        }

        if(!DbTransaction._isBase){
            return netjs.Util.proxy(this);
        } else {
            return this;
        }
    };

    DbTransaction.inheritsFrom(netjs.Class).isType('DbTransaction');

    DbTransaction.prototype.commit = netjs.Abstract.abstractMethod;

    DbTransaction.prototype.rollback = netjs.Abstract.abstractMethod;

    DbTransaction.prototype.dispose = netjs.Abstract.abstractMethod;

    DbTransaction.ensureImplements(netjs.data.IDbTransaction);

    return DbTransaction;

} (netjs));