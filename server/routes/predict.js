const express = require("express");
const router = express.Router();
const axios = require("axios");

const ML_URL = process.env.ML_SERVICE_URL || "http://localhost:8000";

// POST /api/predict — proxy to FastAPI ML service
router.post("/", async (req, res) => {
  try {
    const { data } = await axios.post(`${ML_URL}/predict`, req.body);
    res.json(data);
  } catch (err) {
    const status = err.response?.status || 502;
    const detail = err.response?.data?.detail || "ML service unavailable";
    res.status(status).json({ error: detail });
  }
});

module.exports = router;
