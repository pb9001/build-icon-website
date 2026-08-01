const express = require("express");
const router = express.Router();

const db = require("../config/db");
const upload = require("../middleware/upload");
const verifyToken = require("../middleware/authMiddleware");

// ==============================
// GET ALL DEVELOPERS (PUBLIC)
// ==============================

router.get("/", (req, res) => {

  db.query(

    "SELECT * FROM developers",

    (err, results) => {

      if (err) {
  console.log("❌ SQL ERROR:", err);
  return res.status(500).json({
    message: err.message,
    code: err.code
  });
}

      const developers = results.map((developer) => ({

        ...developer,

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

    }

  );

});

// ==============================
// UPDATE DEVELOPER (PROTECTED)
// ==============================

router.put(

  "/:id",

  verifyToken,

  (req, res) => {

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
        logo,
        JSON.stringify(people),
        JSON.stringify(phones),
        whatsapp,
        req.params.id

      ],

      (err) => {

        console.log(err);

return res.status(500).json({
  message: err.message,
  code: err.code
});

        res.json({

          message: "Developer updated successfully"

        });

      }

    );

  }

);

// ==============================
// UPLOAD DEVELOPER LOGO (PROTECTED)
// ==============================

router.post(

  "/upload-logo",

  verifyToken,

  upload.single("logo"),

  (req, res) => {

    if (!req.file) {

      return res.status(400).json({

        message: "No image uploaded"

      });

    }

    res.json({

      logo: `/uploads/${req.file.filename}`

    });

  }

);

module.exports = router;