const mysql = require("mysql2");

const pool = mysql.createPool({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT,

  ssl: {
    rejectUnauthorized: true
  },

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

console.log("🚀 Using MySQL Connection Pool (SSL Enabled)");

module.exports = pool;