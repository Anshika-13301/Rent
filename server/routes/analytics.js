const express = require("express");
const router = express.Router();
const Property = require("../models/Property");

// GET /api/analytics/avg-rent-by-location
router.get("/avg-rent-by-location", async (_req, res) => {
  try {
    const data = await Property.aggregate([
      { $group: { _id: "$sub_location", avgRent: { $avg: "$actual_rent" }, count: { $sum: 1 } } },
      { $sort: { avgRent: -1 } },
    ]);
    res.json(data.map((d) => ({ location: d._id, avgRent: Math.round(d.avgRent), count: d.count })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/analytics/avg-rent-by-type
router.get("/avg-rent-by-type", async (_req, res) => {
  try {
    const data = await Property.aggregate([
      { $group: { _id: "$property_type", avgRent: { $avg: "$actual_rent" }, count: { $sum: 1 } } },
      { $sort: { avgRent: -1 } },
    ]);
    res.json(data.map((d) => ({ type: d._id, avgRent: Math.round(d.avgRent), count: d.count })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/analytics/price-comparison
router.get("/price-comparison", async (_req, res) => {
  try {
    const data = await Property.aggregate([
      { $match: { predicted_rent: { $ne: null } } },
      {
        $group: {
          _id: "$sub_location",
          avgActual: { $avg: "$actual_rent" },
          avgPredicted: { $avg: "$predicted_rent" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    res.json(
      data.map((d) => ({
        location: d._id,
        avgActual: Math.round(d.avgActual),
        avgPredicted: Math.round(d.avgPredicted),
        count: d.count,
      }))
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/analytics/listing-stats
router.get("/listing-stats", async (_req, res) => {
  try {
    const total = await Property.countDocuments();
    const available = await Property.countDocuments({ is_available: true });
    const rentAgg = await Property.aggregate([
      { $group: { _id: null, avgRent: { $avg: "$actual_rent" } } },
    ]);
    res.json({
      totalListings: total,
      availableListings: available,
      avgRent: rentAgg.length ? Math.round(rentAgg[0].avgRent) : 0,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
