const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const upload = require("../middleware/upload");
const verifyToken = require("../middleware/authMiddleware");
const db = require("../config/db");

// ==========================
// GET ALL IMAGES (PUBLIC)
// ==========================

router.get("/", (req, res) => {

  db.query(

    "SELECT * FROM gallery",

    (err, results) => {

      if (err) {

        return res.status(500).json(err);

      }

      res.json(results);

    }

  );

});

// ==========================
// UPLOAD IMAGE (PROTECTED)
// ==========================

router.post(

  "/upload",

  verifyToken,

  upload.single("image"),

  (req, res) => {

    const newImage = {

      name: req.file.filename,

      url: `http://localhost:5002/uploads/${req.file.filename}`

    };

    db.query(

      "INSERT INTO gallery(name,url) VALUES(?,?)",

      [

        newImage.name,

        newImage.url

      ],

      (err, result) => {

        if (err) {

          return res.status(500).json(err);

        }

        res.json({

          message: "Image uploaded successfully",

          image: {

            id: result.insertId,

            ...newImage

          }

        });

      }

    );

  }

);

// ==========================
// DELETE IMAGE (PROTECTED)
// ==========================

router.delete(

  "/:id",

  verifyToken,

  (req, res) => {

    db.query(

      "SELECT * FROM gallery WHERE id=?",

      [req.params.id],

      (err, result) => {

        if (err) {

          return res.status(500).json(err);

        }

        if (result.length === 0) {

          return res.status(404).json({

            message: "Image not found"

          });

        }

        const image = result[0];

        const filePath = path.join(

          __dirname,

          "../uploads",

          image.name

        );

        if (fs.existsSync(filePath)) {

          fs.unlinkSync(filePath);

        }

        db.query(

          "DELETE FROM gallery WHERE id=?",

          [req.params.id],

          (err) => {

            if (err) {

              return res.status(500).json(err);

            }

            res.json({

              message: "Image deleted successfully"

            });

          }

        );

      }

    );

  }

);

module.exports = router;