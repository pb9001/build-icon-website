const express = require("express");
const router = express.Router();

const db = require("../config/db");
const verifyToken = require("../middleware/authMiddleware");

// ==============================
// GET PROJECT STATUS (PUBLIC)
// ==============================

router.get("/", (req, res) => {

  db.query(
    "SELECT * FROM project_status LIMIT 1",
    (err, result) => {

      if (err) {
        console.log(err);
        return res.status(500).json({
          message: err.message,
          code: err.code
        });
      }

      if (!result || result.length === 0) {
        return res.status(404).json({
          message: "Project status not found"
        });
      }

      const data = result[0];

      const completed =
        typeof data.completed === "string"
          ? JSON.parse(data.completed)
          : data.completed || [];

      const remaining =
        typeof data.remaining === "string"
          ? JSON.parse(data.remaining)
          : data.remaining || [];

      const stages = [
        ...completed.map(item => ({
          name: item,
          status: "completed"
        })),
        {
          name: data.current_stage,
          status: "current"
        },
        ...remaining.map(item => ({
          name: item,
          status: "pending"
        }))
      ];

      res.json({
        id: data.id,
        stages,
        possessionDate: data.possession_date
      });

    }
  );

});

// ==============================
// UPDATE PROJECT STATUS (PROTECTED)
// ==============================

router.put(
  "/",
  verifyToken,
  (req, res) => {

    const stages = req.body.stages || [];

    const current = stages.find(
      stage => stage.status === "current"
    );

    const completed = stages
      .filter(stage => stage.status === "completed")
      .map(stage => stage.name);

    const remaining = stages
      .filter(stage => stage.status === "pending")
      .map(stage => stage.name);

    db.query(
      `UPDATE project_status
       SET current_stage=?,
           completed=?,
           remaining=?,
           possession_date=?
       WHERE id=1`,
      [
        current ? current.name : "",
        JSON.stringify(completed),
        JSON.stringify(remaining),
        req.body.possessionDate
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
          message: "Project Status Updated Successfully"
        });

      }
    );

  }
);

module.exports = router;