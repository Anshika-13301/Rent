const express = require("express");
const router = express.Router();
const Property = require("../models/Property");

// 1. GET ALL PROPERTIES (Is route ki wajah se GET par 404 aa raha tha)
router.get("/", async (_req, res) => {
  try {
    const properties = await Property.find().sort({ createdAt: -1 });
    res.json(properties);
  } catch (error) {
    console.error("Error fetching properties:", error);
    res.status(500).json({ error: "Failed to fetch properties" });
  }
});

// 2. POST /api/properties (Property List karne ka endpoint)
router.post("/", async (req, res) => {
  try {
    const rentAmount = Number(
      req.body.actual_rent || req.body.price || req.body.asked_price
    );

    const newProperty = new Property({
      title: req.body.title,
      owner_name: req.body.owner_name,
      owner_contact: req.body.owner_contact,
      sub_location: req.body.sub_location,
      property_type: req.body.property_type,
      area_sqft: Number(req.body.area_sqft),
      distance_to_station_km: Number(req.body.distance_to_station_km),
      furnishing: req.body.furnishing,
      floor_number: Number(req.body.floor_number) || 1,
      building_age_years: Number(req.body.building_age_years) || 1,
      actual_rent: rentAmount,
      price: rentAmount,
      amenities: req.body.amenities || {},
    });

    const savedProperty = await newProperty.save();
    console.log("✅ Property Saved to MongoDB:", savedProperty._id);
    res.status(201).json(savedProperty);
  } catch (error) {
    console.error("❌ MongoDB Save Error:", error.message);
    res.status(400).json({ error: error.message });
  }
});

// 3. DELETE PROPERTY BY ID
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Property.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Property not found" });
    }
    res.json({ message: "Property deleted successfully" });
  } catch (error) {
    console.error("Error deleting property:", error);
    res.status(500).json({ error: "Failed to delete property" });
  }
});

module.exports = router;