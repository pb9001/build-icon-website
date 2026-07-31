const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET; 

router.post("/login", (req, res) => {

    const { username, password } = req.body;

    console.log("Username received:", username);
    console.log("Password received:", password);

    db.query(
        "SELECT * FROM admin_users WHERE username = ?",
        [username],
        async (err, results) => {

            if (err) {
                return res.status(500).json({ message: "Database Error" });
            }

            if (results.length === 0) {
                return res.status(401).json({ message: "Invalid Username or Password" });
            }

            const admin = results[0];
            console.log("Username from DB:", admin.username);
            console.log("Password hash from DB:", admin.password);

            const match = await bcrypt.compare(password, admin.password);

            if (!match) {
                return res.status(401).json({ message: "Invalid Username or Password" });
            }

            const token = jwt.sign(
                {
                    id: admin.id,
                    username: admin.username
                },
                JWT_SECRET,
                {
                    expiresIn: "8h"
                }
            );

            res.json({
                message: "Login Successful",
                token
            });

        }
    );

});

module.exports = router;