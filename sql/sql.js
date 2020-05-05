var mysql = require('mysql');

var connection = mysql.createConnection({
  host: process.env.SQL_HOST,
  user: process.env.SQL_USER,
  password: process.env.SQL_PASS,
  database: process.env.SQL_DB
});

connection.connect(function(err) {
    if (err) throw err;
});

module.exports = connection;