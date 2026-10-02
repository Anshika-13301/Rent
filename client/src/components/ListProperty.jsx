import React, { useState } from 'react';

const ListProperty = () => {
  const [formData, setFormData] = useState({
    title: '',
    owner_name: '',
    owner_contact: '',
    sub_location: 'Dadar',
    property_type: '2BHK',
    area_sqft: 500,
    distance_to_station_km: 1.5,
    furnishing: 'Semi-Furnished',
    floor_number: 3,
    building_age_years: 5,
    asked_price: '',
    amenities: {
      wifi: false,
      ac: false,
      parking: false,
      food: false,
    },
  });

  const [suggestedRent, setSuggestedRent] = useState(null);
  const [loadingML, setLoadingML] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAmenityChange = (key) => {
    setFormData((prev) => ({
      ...prev,
      amenities: { ...prev.amenities, [key]: !prev.amenities[key] },
    }));
  };

  // 1. ML Fair Rent Estimate Fetch Function
  const handleEstimateFairRent = async () => {
    setLoadingML(true);
    try {
      const payload = {
        sub_location: formData.sub_location,
        property_type: formData.property_type,
        distance_to_station_km: Number(formData.distance_to_station_km) || 1.5,
        area_sqft: Number(formData.area_sqft) || 500,
        amenities_wifi: formData.amenities.wifi ? 1 : 0,
        amenities_ac: formData.amenities.ac ? 1 : 0,
        amenities_parking: formData.amenities.parking ? 1 : 0,
        amenities_food: formData.amenities.food ? 1 : 0,
        furnishing: formData.furnishing,
        floor_number: Number(formData.floor_number) || 1,
        building_age_years: Number(formData.building_age_years) || 1,
      };

      const res = await fetch('http://localhost:5000/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.predicted_rent !== undefined) {
        setSuggestedRent(data.predicted_rent);
      } else {
        alert(`Prediction Error: ${data.error || 'Check browser console'}`);
      }
    } catch (err) {
      console.error('Error fetching ML estimate:', err);
      alert('Prediction Failed! Ensure Node.js (5000) and FastAPI (8000) are running.');
    } finally {
      setLoadingML(false);
    }
  };

  // 2. Submit Listing to Express Backend + MongoDB
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');

    const rentValue = Number(formData.asked_price) || suggestedRent || 25000;

    try {
      const payload = {
        title: formData.title,
        owner_name: formData.owner_name,
        owner_contact: formData.owner_contact,
        sub_location: formData.sub_location,
        property_type: formData.property_type,
        area_sqft: Number(formData.area_sqft),
        distance_to_station_km: Number(formData.distance_to_station_km),
        furnishing: formData.furnishing,
        floor_number: Number(formData.floor_number) || 1,
        building_age_years: Number(formData.building_age_years) || 1,
        actual_rent: rentValue,
        price: rentValue,
        amenities: formData.amenities,
      };

      const res = await fetch('http://localhost:5000/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setMessage('✅ Property listed successfully!');
        setFormData({
          title: '',
          owner_name: '',
          owner_contact: '',
          sub_location: 'Dadar',
          property_type: '2BHK',
          area_sqft: 500,
          distance_to_station_km: 1.5,
          furnishing: 'Semi-Furnished',
          floor_number: 3,
          building_age_years: 5,
          asked_price: '',
          amenities: { wifi: false, ac: false, parking: false, food: false },
        });
        setSuggestedRent(null);
      } else {
        const errorData = await res.json();
        setMessage(`❌ Failed to submit: ${errorData.error || errorData.message || 'Server Error'}`);
      }
    } catch (err) {
      console.error(err);
      setMessage('❌ Network Error while listing property.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 py-10 px-4 flex justify-center">
      <div className="max-w-3xl w-full bg-[#0d111a] border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl">
        <h2 className="text-3xl font-bold text-center mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-indigo-400 to-teal-300">
          List Your Property
        </h2>
        <p className="text-slate-400 text-center text-sm mb-8">
          Fill in details below. Our ML model will recommend a fair rent price for your listing.
        </p>

        {message && (
          <div className="mb-6 p-4 rounded-xl bg-slate-800 border border-slate-700 text-center text-sm font-medium">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase">
              Property Title / Headline
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Spacious 2BHK near Dadar Station"
              required
              className="w-full bg-[#131926] border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Owner Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase">
                Owner Name
              </label>
              <input
                type="text"
                name="owner_name"
                value={formData.owner_name}
                onChange={handleChange}
                placeholder="e.g. Rahul Sharma"
                required
                className="w-full bg-[#131926] border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase">
                Owner Contact / Phone
              </label>
              <input
                type="text"
                name="owner_contact"
                value={formData.owner_contact}
                onChange={handleChange}
                placeholder="e.g. 9876543210"
                required
                className="w-full bg-[#131926] border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Grid Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase">
                Sub-Location
              </label>
              <select
                name="sub_location"
                value={formData.sub_location}
                onChange={handleChange}
                className="w-full bg-[#131926] border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="Dadar">Dadar</option>
                <option value="Andheri">Andheri</option>
                <option value="Bandra">Bandra</option>
                <option value="Vasai">Vasai</option>
                <option value="Virar">Virar</option>
                <option value="Thane">Thane</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase">
                Property Type
              </label>
              <select
                name="property_type"
                value={formData.property_type}
                onChange={handleChange}
                className="w-full bg-[#131926] border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="1BHK">1BHK</option>
                <option value="2BHK">2BHK</option>
                <option value="3BHK">3BHK</option>
                <option value="PG / Room">PG / Room</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase">
                Area (sq ft)
              </label>
              <input
                type="number"
                name="area_sqft"
                value={formData.area_sqft}
                onChange={handleChange}
                className="w-full bg-[#131926] border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase">
                Distance to Station (km)
              </label>
              <input
                type="number"
                step="0.1"
                name="distance_to_station_km"
                value={formData.distance_to_station_km}
                onChange={handleChange}
                className="w-full bg-[#131926] border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase">
                Furnishing
              </label>
              <select
                name="furnishing"
                value={formData.furnishing}
                onChange={handleChange}
                className="w-full bg-[#131926] border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="Unfurnished">Unfurnished</option>
                <option value="Semi-Furnished">Semi-Furnished</option>
                <option value="Fully-Furnished">Fully-Furnished</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase">
                Building Age (Years)
              </label>
              <input
                type="number"
                name="building_age_years"
                value={formData.building_age_years}
                onChange={handleChange}
                className="w-full bg-[#131926] border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Amenities */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase">
              Amenities
            </label>
            <div className="flex flex-wrap gap-3">
              {['wifi', 'ac', 'parking', 'food'].map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleAmenityChange(key)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all border ${
                    formData.amenities[key]
                      ? 'bg-indigo-600 border-indigo-500 text-white'
                      : 'bg-[#131926] border-slate-700 text-slate-400 hover:border-slate-500'
                  }`}
                >
                  {key}
                </button>
              ))}
            </div>
          </div>

          {/* ML Estimate Banner */}
          <div className="bg-[#131926] border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                ML Fair Price Suggestion
              </p>
              <p className="text-2xl font-bold mt-1">
                {suggestedRent !== null
                  ? `₹${Number(suggestedRent).toLocaleString('en-IN')} / mo`
                  : '—'}
              </p>
            </div>
            <button
              type="button"
              onClick={handleEstimateFairRent}
              disabled={loadingML}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-xl text-xs font-semibold text-slate-200 transition-all"
            >
              {loadingML ? 'Calculating...' : 'Get ML Rent Recommendation'}
            </button>
          </div>

          {/* Final Asking Rent */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase">
              Your Monthly Asking Rent (₹)
            </label>
            <input
              type="number"
              name="asked_price"
              value={formData.asked_price}
              onChange={handleChange}
              placeholder={suggestedRent !== null ? `Suggested: ₹${suggestedRent}` : 'e.g. 32000'}
              required
              className="w-full bg-[#131926] border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-teal-500 rounded-xl font-semibold text-sm tracking-wide text-white hover:opacity-95 transition-all shadow-lg"
          >
            {submitting ? 'Submitting Property...' : 'Publish Property Listing'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ListProperty;