netjs.SystemException = (function (netjs) {

    var SystemException = function (){};

    SystemException.inheritsFrom(netjs.Exception).isType('SystemException');

    return SystemException;

} (netjs));
