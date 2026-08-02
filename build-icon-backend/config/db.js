const mysql = require("mysql2");

const db = mysql.createConnection({
  host: process.env.MYSQLHOST || process.env.DB_HOST,
  user: process.env.MYSQLUSER || process.env.DB_USER,
  password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD,
  database: process.env.MYSQLDATABASE || process.env.DB_NAME,
  port: process.env.MYSQLPORT || process.env.DB_PORT,
});

db.connect((err) => {
  if (err) {
    console.error("❌ MySQL Connection Failed");
    console.error(err);
    return;
  }

  console.log("✅ MySQL Connected Successfully");
});

module.exports = db;