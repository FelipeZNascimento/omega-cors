var mysql = require('mysql');
var port = process.env.PORT || 4205;

if (port === 4205) {
  var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'omegafox_shopping'
  });
} else {
  var connection = mysql.createConnection({
    host: process.env.SQL_HOST,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASS,
    database: process.env.SQL_DB
  });
}

connection.connect(function (err) {
  if (err) throw err;
});

module.exports = connection;