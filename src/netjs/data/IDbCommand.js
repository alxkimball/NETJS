netjs.data.IDbCommand = (function (netjs) {

    var IDbCommand = new netjs.Interface('IDbCommand', ['getCommandText', 'setCommandText', 'getCommandTimeout'
        , 'setCommandTimeout', 'getCommandType', 'setCommandType', 'getConnection', 'setConnection', 'getTransaction'
        , 'setTransaction', 'cancel', 'executeNonQueryAsync', 'executeReaderAsync', 'executeScalarAsync'])

    //IDbCommand extends IDisposable
    IDbCommand = netjs.Interface.extendInterface(IDbCommand, netjs.IDisposable);
    //TODO createParameter, getParameters, get/setUpdateRowSource, prepare

    return IDbCommand;

} (netjs));
