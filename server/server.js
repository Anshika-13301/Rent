require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");

const propertiesRouter = require("./routes/properties");
const predictRouter = require("./routes/predict");
const analyticsRouter = require("./routes/analytics");

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ──────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// ── Welcome / Root Route (Fixes GET / 404) ─────────────────────────────
app.get("/", (_req, res) => {
  res.json({
    message: "🚀 RentSense API Backend is Running!",
    health: "/api/health",
    endpoints: {
      properties: "/api/properties",
      predict: "/api/predict",
      analytics: "/api/analytics"
    }
  });
});

// ── Routes ─────────────────────────────────────────────────────────────
app.use("/api/properties", propertiesRouter);
app.use("/api/predict", predictRouter);
app.use("/api/analytics", analyticsRouter);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ── 404 Handler (Unmatched Routes) ────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ── Error handler ──────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
});

// ── MongoDB + Start ────────────────────────────────────────────────────
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });