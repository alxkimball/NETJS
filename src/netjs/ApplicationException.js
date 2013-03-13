netjs.ApplicationException = (function (netjs) {

    var ApplicationException = function (){};

    ApplicationException.inheritsFrom(netjs.Exception).isType('ApplicationException');

    return ApplicationException;

} (netjs));
