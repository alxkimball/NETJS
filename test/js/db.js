var config = require('./../app.config.js');
var assert = require( 'assert' );
// Query with explicit connection
var _sql = require('node-sqlserver');
var _conn_str = "Driver={SQL Server Native Client 11.0};"
    + "Server=" + config.server +  ";"
    + "Database=" + config.database + ";"
    + "Trusted_Connection={Yes}";

var _db = function () {};

_db.prototype.executeSql = function(sqlStmt, errHandler, resultHandler) {
    _sql.open(_conn_str,  function( err, conn ) {

        if(err){
            errHandler(err);
            return;
        } else {
            console.log('db connection succeeded now executing statement');
            conn.queryRaw(sqlStmt, function (err, results) {
                if (err) {
                    console.log("Error running query!");
                    errHandler(err);
                    return;
                }
                resultHandler(results);
                return;
            });
        }
    });
};

module.exports = _db;