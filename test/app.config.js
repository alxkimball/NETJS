var config = {
    server: '(local)',
    database: 'FEUX'
};

config.connectionString = "Driver={SQL Server Native Client 11.0};"
    + "Server=" + config.server +  ";"
    + "Database=" + config.database + ";"
    + "Trusted_Connection={Yes}";

config.sqlclient_provider = require('node-sqlserver');
global._ = require('underscore');
global.jQuery = require('jquery');
global.config = config;
global.netjs = require('../dist/netjs.full.js');
module.exports = config;