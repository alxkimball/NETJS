netjs.data.IDbConnection = (function (netjs) {
    'use strict';

    var IDbConnection = new netjs.Interface('IDbConnection', ['getConnectionString', 'setConnectionString'
        , 'getConnectionTimeout', 'getDatabase', 'getState', 'beginTransaction', 'changeDatabase', 'close'
        , 'createCommand', 'openAsync']);
    //IDbConnection extends IDisposable
    IDbConnection = netjs.Interface.extendInterface(IDbConnection, netjs.IDisposable);

    return IDbConnection;
} (netjs));
