require("dotenv").config();

const mysql = require("mysql2");

console.log("🚀 USING RAILWAY MYSQL CONFIG");

const db = mysql.createConnection({

  host: process.env.DB_HOST,

  user: process.env.DB_USER,

  password: process.env.DB_PASSWORD,

  database: process.env.DB_NAME,

  port: process.env.DB_PORT

});


console.log("Database Host:", process.env.DB_HOST);
console.log("Database User:", process.env.DB_USER);
console.log("Database Name:", process.env.DB_NAME);
console.log("Database Port:", process.env.DB_PORT);


db.connect((err) => {

  if (err) {

    console.log("❌ MySQL Connection Failed");
    console.log(err);

    return;

  }


  console.log("✅ Railway MySQL Connected Successfully");

});


module.exports = db;