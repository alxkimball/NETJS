netjs.Util.IEventObserver = (function (netjs){
    'use strict';

    var IEventObserver = new netjs.Interface('IEventObserver', ['subscribe', 'unsubscribe', 'publish']);

    return IEventObserver;
}(netjs));