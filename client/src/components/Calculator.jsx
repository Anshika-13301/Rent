import { useState } from "react";
import { predictRent } from "../api";
import toast from "react-hot-toast";
import { FaRupeeSign, FaWifi, FaSnowflake, FaCar, FaUtensils } from "react-icons/fa";

const SUB_LOCATIONS = ["Andheri", "Bandra", "Powai", "Dadar", "Malad", "Thane", "Borivali", "Juhu", "Worli", "Goregaon"];
const PROPERTY_TYPES = ["PG", "1BHK", "2BHK", "Shared Room", "Studio"];
const FURNISHING = ["Unfurnished", "Semi-Furnished", "Fully-Furnished"];

const initialForm = {
  sub_location: "Andheri",
  property_type: "1BHK",
  distance_to_station_km: 1.5,
  area_sqft: 450,
  amenities_wifi: 1,
  amenities_ac: 0,
  amenities_parking: 0,
  amenities_food: 0,
  furnishing: "Semi-Furnished",
  floor_number: 3,
  building_age_years: 5,
};

export default function Calculator() {
  const [form, setForm] = useState(initialForm);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const set = (key, val) => setForm((p) => ({ ...p, [key]: val }));
  const toggleAmenity = (key) => set(key, form[key] ? 0 : 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const data = await predictRent(form);
      setResult(data);
      toast.success("Prediction ready!");
    } catch {
      toast.error("Prediction failed — is the ML service running?");
    } finally {
      setLoading(false);
    }
  };

  const amenities = [
    { key: "amenities_wifi", label: "WiFi", icon: FaWifi },
    { key: "amenities_ac", label: "AC", icon: FaSnowflake },
    { key: "amenities_parking", label: "Parking", icon: FaCar },
    { key: "amenities_food", label: "Food", icon: FaUtensils },
  ];

  return (
    <section className="max-w-5xl mx-auto px-4 py-12">
      {/* Hero */}
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
          <span className="bg-gradient-to-r from-primary-400 via-primary-500 to-accent-400 bg-clip-text text-transparent">
            Find Your Fair Rent
          </span>
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Enter property details and our ML model predicts the fair market rent for your area in seconds.
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-3 bg-gray-800/50 backdrop-blur border border-gray-700 rounded-2xl p-6 space-y-6">
          {/* Row 1: Location + Type */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Sub-Location</label>
              <select
                value={form.sub_location}
                onChange={(e) => set("sub_location", e.target.value)}
                className="w-full bg-gray-900 border-gray-700 rounded-lg text-gray-100 focus:ring-primary-500 focus:border-primary-500"
              >
                {SUB_LOCATIONS.map((l) => <option key={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Property Type</label>
              <select
                value={form.property_type}
                onChange={(e) => set("property_type", e.target.value)}
                className="w-full bg-gray-900 border-gray-700 rounded-lg text-gray-100 focus:ring-primary-500 focus:border-primary-500"
              >
                {PROPERTY_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>

          {/* Row 2: Distance + Area */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Distance to Station (km): <span className="text-accent-400 font-semibold">{form.distance_to_station_km}</span>
              </label>
              <input
                type="range" min="0.1" max="5" step="0.1"
                value={form.distance_to_station_km}
                onChange={(e) => set("distance_to_station_km", parseFloat(e.target.value))}
                className="w-full accent-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Area (sq ft)</label>
              <input
                type="number" min="50" max="5000"
                value={form.area_sqft}
                onChange={(e) => set("area_sqft", parseInt(e.target.value) || 0)}
                className="w-full bg-gray-900 border-gray-700 rounded-lg text-gray-100 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          {/* Amenities toggles */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">Amenities</label>
            <div className="flex flex-wrap gap-3">
              {amenities.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => toggleAmenity(key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all ${
                    form[key]
                      ? "bg-primary-600/20 border-primary-500 text-primary-400"
                      : "bg-gray-900 border-gray-700 text-gray-500 hover:border-gray-600"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Row 3: Furnishing + Floor + Age */}
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Furnishing</label>
              <select
                value={form.furnishing}
                onChange={(e) => set("furnishing", e.target.value)}
                className="w-full bg-gray-900 border-gray-700 rounded-lg text-gray-100 focus:ring-primary-500 focus:border-primary-500"
              >
                {FURNISHING.map((f) => <option key={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Floor Number</label>
              <input
                type="number" min="0" max="50"
                value={form.floor_number}
                onChange={(e) => set("floor_number", parseInt(e.target.value) || 0)}
                className="w-full bg-gray-900 border-gray-700 rounded-lg text-gray-100 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Building Age (yrs)</label>
              <input
                type="number" min="0" max="100"
                value={form.building_age_years}
                onChange={(e) => set("building_age_years", parseInt(e.target.value) || 0)}
                className="w-full bg-gray-900 border-gray-700 rounded-lg text-gray-100 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-primary-600 to-accent-500 hover:from-primary-500 hover:to-accent-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" /></svg>
                Predicting…
              </span>
            ) : (
              "Predict Rent"
            )}
          </button>
        </form>

        {/* Result Card */}
        <div className="lg:col-span-2 flex items-start">
          {result ? (
            <div className="w-full bg-gray-800/50 backdrop-blur border border-gray-700 rounded-2xl p-6 space-y-6">
              <h3 className="text-lg font-semibold text-gray-300">Predicted Rent</h3>
              <p className="text-5xl font-extrabold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent flex items-center">
                <FaRupeeSign className="w-8 h-8 text-primary-400 mr-1" />
                {Number(result.predicted_rent).toLocaleString("en-IN")}
              </p>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-400">Range:</span>
                <span className="text-sm font-medium text-gray-200">
                  ₹{Number(result.rent_range.min).toLocaleString("en-IN")} — ₹{Number(result.rent_range.max).toLocaleString("en-IN")}
                </span>
              </div>
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                  result.confidence === "High"
                    ? "bg-green-500/20 text-green-400"
                    : result.confidence === "Medium"
                    ? "bg-yellow-500/20 text-yellow-400"
                    : "bg-red-500/20 text-red-400"
                }`}
              >
                {result.confidence} Confidence
              </span>
              <p className="text-xs text-gray-500 mt-2">
                Prediction based on 200-tree Random Forest model trained on local rental data.
              </p>
            </div>
          ) : (
            <div className="w-full bg-gray-800/30 border border-dashed border-gray-700 rounded-2xl p-8 flex flex-col items-center justify-center text-center text-gray-500">
              <FaRupeeSign className="w-12 h-12 mb-4 text-gray-700" />
              <p>Fill the form and hit <strong>Predict Rent</strong> to see your fair price estimate.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
