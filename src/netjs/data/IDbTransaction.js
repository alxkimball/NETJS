netjs.data.IDbTransaction = (function (netjs){

    var IDbTransaction = new netjs.Interface('IDbTransaction', ['commit', 'rollback']);

    //IDbCommand extends IDisposable
    IDbTransaction = netjs.Interface.extendInterface(IDbTransaction, netjs.IDisposable);

    return IDbTransaction;

} (netjs));
