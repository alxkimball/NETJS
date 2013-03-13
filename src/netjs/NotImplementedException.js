netjs.NotImplementedException = (function (netjs) {

    var NotImplementedException = function (){};

    NotImplementedException.inheritsFrom(netjs.SystemException).isType('NotImplementedException');

    return NotImplementedException;

} (netjs));
