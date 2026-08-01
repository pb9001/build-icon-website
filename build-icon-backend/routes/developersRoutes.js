const express = require("express");
const router = express.Router();

const db = require("../config/db");
const upload = require("../middleware/upload");
const verifyToken = require("../middleware/authMiddleware");

const BASE_URL =
  process.env.BASE_URL ||
  "https://build-icon-website-production.up.railway.app";

// ==============================
// GET ALL DEVELOPERS
// ==============================

router.get("/", (req, res) => {

  db.query("SELECT * FROM developers", (err, results) => {

    if (err) {
      console.log(err);

      return res.status(500).json({
        message: err.message,
        code: err.code
      });
    }

    const developers = results.map((developer) => ({

      ...developer,

      logo: `${BASE_URL}${developer.logo}`,

      people:
        typeof developer.people === "string"
          ? JSON.parse(developer.people)
          : developer.people,

      phones:
        typeof developer.phones === "string"
          ? JSON.parse(developer.phones)
          : developer.phones

    }));

    res.json(developers);

  });

});

// ==============================
// UPDATE DEVELOPER
// ==============================

router.put("/:id", verifyToken, (req, res) => {

  const {
    company,
    logo,
    people,
    phones,
    whatsapp
  } = req.body;

  db.query(

    `UPDATE developers
     SET company=?,
         logo=?,
         people=?,
         phones=?,
         whatsapp=?
     WHERE id=?`,

    [
      company,
      logo.replace(BASE_URL, ""),
      JSON.stringify(people),
      JSON.stringify(phones),
      whatsapp,
      req.params.id
    ],

    (err) => {

      if (err) {
        console.log(err);

        return res.status(500).json({
          message: err.message,
          code: err.code
        });
      }

      res.json({
        message: "Developer updated successfully"
      });

    }

  );

});

// ==============================
// UPLOAD LOGO
// ==============================

router.post(

  "/upload-logo",

  verifyToken,

  upload.single("logo"),

  (req, res) => {

    if (!req.file) {

      return res.status(400).json({
        message: "No logo uploaded"
      });

    }

    res.json({

      logo: `${BASE_URL}/uploads/${req.file.filename}`

    });

  }

);

module.exports = router;