netjs.data.IDataRecord = (function (netjs) {

    var IDataRecord = new netjs.Interface('IDataRecord', ['getValue', 'getNumber', 'getText', 'getDate']);
    //getBool?, getDataType, getName

    //IDbCommand extends IDisposable
    IDataRecord = netjs.Interface.extendInterface(IDataRecord, netjs.IDisposable);

    return IDataRecord;

} (netjs));