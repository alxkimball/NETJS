
/*
 * GET home page.
 */
var config = require('../app.config.js');
var conn_str = config.connectionString;


var netjs = global.netjs;

var using = function (disposable, fnScope){
    var def = global.jQuery.when(fnScope())
        .done(function () {
            //TODO do undeined, null, has dispose() checks
            disposable.dispose();
        });
};

var usingAsync = function (disposable, promise){
    promise.then(function (){
        disposable.dispose();
    });
};

exports.index = function(req, res){
   //do db test
    var dbConn = 'BAD';
    var queryString = 'SELECT * FROM REQUEST';

    var connection = new netjs.data.sqlclient.SqlConnection(config.connectionString);
    var  command = connection.createCommand();
    command.setCommandText(queryString);
    usingAsync(connection,
     command.getConnection().openAsync()
     .pipe(command.executeReaderAsync)
     .done(function (results){
        dbConn = 'GOOD';
        res.render('index',
            { title: 'Express Test' ,
              dbConn: 'Good',
              meta: results.meta,
              rows: results.rows});
     })
     .fail(function (error) {
     res.render('index', { title: 'Express Test' , dbConn: 'Failed ' + error});
     }));
};