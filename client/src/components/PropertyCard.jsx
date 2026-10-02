import React from "react";

const PropertyCard = ({ property }) => {
  if (!property) return null;

  const rent = property.actual_rent || property.price || property.asked_price || 0;

  return (
    <div className="bg-gray-900 border border-gray-800 p-5 rounded-2xl shadow-xl flex flex-col justify-between hover:border-gray-700 transition-all">
      <div>
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-white line-clamp-1">
            {property.title || `${property.property_type} in ${property.sub_location}`}
          </h3>
          <span className="px-2.5 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-lg text-xs font-medium">
            {property.property_type}
          </span>
        </div>

        <p className="text-xs text-gray-400 mb-3">
          📍 {property.sub_location} • {property.area_sqft || 500} sq ft • {property.distance_to_station_km || 1} km station
        </p>

        <p className="text-2xl font-bold text-emerald-400 mb-4">
          ₹{Number(rent).toLocaleString("en-IN")}{" "}
          <span className="text-xs font-normal text-gray-400">/ mo</span>
        </p>
      </div>

      <div className="text-xs text-gray-400 space-y-1.5 border-t border-gray-800 pt-3 mt-2">
        <div className="flex justify-between">
          <span className="text-gray-500">Furnishing:</span>
          <span className="text-slate-300 font-medium">{property.furnishing || "N/A"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Owner:</span>
          <span className="text-slate-300 font-medium">{property.owner_name || "N/A"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Contact:</span>
          <span className="text-indigo-400 font-medium">{property.owner_contact || "N/A"}</span>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;