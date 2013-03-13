netjs.InvalidOperationException = (function (netjs) {

    var InvalidOperationException = function (){};

    InvalidOperationException.inheritsFrom(netjs.SystemException).isType('InvalidOperationException');

    return InvalidOperationException;

} (netjs));
