netjs.IDisposable = (function (netjs){
    'use strict';

    var IDisposable = new netjs.Interface('IDisposable', ['dispose']);

    return IDisposable;
}(netjs));
