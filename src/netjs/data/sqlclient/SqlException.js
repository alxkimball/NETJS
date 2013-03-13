netjs.data.sqlclient.SqlException = (function (netjs) {

    var SqlException = function (){};

    SqlException.inheritsFrom(netjs.SystemException).isType('SqlException');

    return SqlException;

} (netjs));