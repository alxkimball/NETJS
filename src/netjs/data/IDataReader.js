netjs.data.IDataReader = (function (netjs) {

    var IDataReader = new netjs.Interface('IDataReader', ['close', 'read']);

    //IDbCommand extends IDisposable
    IDataReader = netjs.Interface.extendInterface(IDataReader, netjs.data.IDataRecord, netjs.IDisposable);

    return IDataReader;

} (netjs));