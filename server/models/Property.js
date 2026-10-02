const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    sub_location: {
      type: String,
      required: true,
      enum: [
        "Andheri", "Bandra", "Powai", "Dadar", "Malad",
        "Thane", "Borivali", "Juhu", "Worli", "Goregaon",
      ],
    },
    property_type: {
      type: String,
      required: true,
      enum: ["PG", "1BHK", "2BHK", "Shared Room", "Studio"],
    },
    actual_rent: { type: Number, required: true },
    predicted_rent: { type: Number, default: null },
    distance_to_station_km: { type: Number, required: true },
    area_sqft: { type: Number, required: true },
    amenities: {
      wifi: { type: Boolean, default: false },
      ac: { type: Boolean, default: false },
      parking: { type: Boolean, default: false },
      food: { type: Boolean, default: false },
    },
    furnishing: {
      type: String,
      enum: ["Unfurnished", "Semi-Furnished", "Fully-Furnished"],
      default: "Unfurnished",
    },
    floor_number: { type: Number, default: 0 },
    building_age_years: { type: Number, default: 0 },
    owner_name: { type: String, required: true, trim: true },
    owner_contact: { type: String, required: true, trim: true },
    is_available: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Property", propertySchema);
