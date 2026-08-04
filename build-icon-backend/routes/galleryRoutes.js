const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const upload = require("../middleware/upload");
const verifyToken = require("../middleware/authMiddleware");
const db = require("../config/db");

// Railway URL
const BASE_URL =
  process.env.BASE_URL ||
  "https://build-icon-api.onrender.com";

// =======================================
// GET ALL IMAGES (PUBLIC)
// =======================================

router.get("/", (req, res) => {

  db.query("SELECT * FROM gallery", (err, results) => {

    if (err) {
      console.log(err);

      return res.status(500).json({
        message: err.message,
        code: err.code
      });
    }

    const gallery = results.map((image) => ({
      id: image.id,
      name: image.name,
      url: `${BASE_URL}/uploads/${image.name}`
    }));

    res.json(gallery);

  });

});

// =======================================
// UPLOAD IMAGE
// =======================================

router.post(
  "/upload",
  verifyToken,
  upload.single("image"),
  (req, res) => {

    if (!req.file) {
      return res.status(400).json({
        message: "No image uploaded"
      });
    }

    const imageName = req.file.filename;

    const imageUrl = `${BASE_URL}/uploads/${imageName}`;

    db.query(
      "INSERT INTO gallery(name,url) VALUES(?,?)",
      [imageName, imageUrl],
      (err, result) => {

        if (err) {
          console.log(err);

          return res.status(500).json({
            message: err.message,
            code: err.code
          });
        }

        res.json({
          message: "Image uploaded successfully",
          image: {
            id: result.insertId,
            name: imageName,
            url: imageUrl
          }
        });

      }
    );

  }
);

// =======================================
// DELETE IMAGE
// =======================================

router.delete(
  "/:id",
  verifyToken,
  (req, res) => {

    db.query(
      "SELECT * FROM gallery WHERE id=?",
      [req.params.id],
      (err, result) => {

        if (err) {
          console.log(err);

          return res.status(500).json({
            message: err.message,
            code: err.code
          });
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
              console.log(err);

              return res.status(500).json({
                message: err.message,
                code: err.code
              });
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