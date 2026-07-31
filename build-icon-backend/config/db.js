const mysql = require("mysql2");

console.log("🚀 USING BUILDICON DB CONFIG");

const db = mysql.createConnection({

host:"localhost",

user:"buildicon",

password:"buildicon123",

database:"build_icon_db"

});

console.log(db.config.user);

db.connect((err)=>{

if(err){

console.log("❌ MySQL Connection Failed");

console.log(err);

return;

}

console.log("✅ MySQL Connected Successfully");

});

module.exports=db;