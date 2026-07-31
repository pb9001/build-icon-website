const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./config/db");

const app = express();

const PORT = 5002;

// ==========================
// MIDDLEWARE
// ==========================

app.use(cors());

app.use(express.json());

// ==========================
// STATIC UPLOADS
// ==========================

app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
);

// ==========================
// ROUTES
// ==========================

const projectStatusRoutes = require(
  "./routes/projectStatusRoutes"
);

const galleryRoutes = require(
  "./routes/galleryRoutes"
);

const developersRoutes = require(
  "./routes/developersRoutes"
);

// ==========================
// API ROUTES
// ==========================

app.use(
  "/project-status",
  projectStatusRoutes
);

app.use(
  "/gallery",
  galleryRoutes
);

app.use(
  "/developers",
  developersRoutes
);

// ==========================
// HOME ROUTE
// ==========================

app.get("/", (req, res) => {

  res.send(
    "Build Icon Backend Working 🚀"
  );

});

// ==========================
// SERVER START
// ==========================

app.listen(PORT, () => {

  console.log(
    `🚀 Server running on http://localhost:${PORT}`
  );

});