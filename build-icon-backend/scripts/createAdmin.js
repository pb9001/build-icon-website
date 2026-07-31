const bcrypt = require("bcrypt");
const db = require("../config/db");

const username = "admin";
const password = "1234"; // Change later if you want

async function createAdmin() {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
      "INSERT INTO admin_users (username, password) VALUES (?, ?)",
      [username, hashedPassword],
      (err) => {
        if (err) {
          console.log("❌ Error creating admin");
          console.log(err);
        } else {
          console.log("✅ Admin created successfully");
        }

        db.end();
      }
    );
  } catch (error) {
    console.log(error);
    db.end();
  }
}

createAdmin();