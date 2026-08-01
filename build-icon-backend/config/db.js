const mysql = require("mysql2");

console.log("🚀 USING RAILWAY MYSQL CONFIG");

const db = mysql.createConnection({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT
});

console.log("Database Host:", process.env.MYSQLHOST);
console.log("Database User:", process.env.MYSQLUSER);
console.log("Database Name:", process.env.MYSQLDATABASE);
console.log("Database Port:", process.env.MYSQLPORT);

db.connect((err) => {
  if (err) {
    console.log("❌ MySQL Connection Failed");
    console.log(err);
    return;
  }
  console.log("✅ Railway MySQL Connected Successfully");
});

module.exports = db;