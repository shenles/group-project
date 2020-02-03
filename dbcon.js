var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs361_clemeant',
  password        : '****',
  database        : 'cs361_clemeant'
});

module.exports.pool = pool;
