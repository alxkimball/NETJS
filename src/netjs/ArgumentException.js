netjs.ArgumentException = (function (netjs) {

    var ArgumentException = function (){};

    ArgumentException.inheritsFrom(netjs.SystemException).isType('ArgumentException');

    return ArgumentException;

} (netjs));

