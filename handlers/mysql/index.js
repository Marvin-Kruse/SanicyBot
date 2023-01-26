var mysql = require('mysql');
const mysqlconfig = require('../../config/mysql/settings.json')
var connection = mysql.createConnection({
    host: mysqlconfig.host,
    user: mysqlconfig.user,
    password: mysqlconfig.password,
    database: mysqlconfig.database
});

connection.connect(function (err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }

    console.log('connected as id ' + connection.threadId);
});

module.exports.connection = connection