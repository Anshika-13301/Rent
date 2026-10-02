import React, { useState, useEffect, useMemo } from 'react';
import PropertyCard from './PropertyCard';
import { Search, Filter, RotateCcw } from 'lucide-react';

const PRESET_LOCATIONS = [
  'Dadar',
  'Andheri',
  'Bandra',
  'Vasai',
  'Virar',
  'Thane',
  'Borivali',
  'Malad',
  'Goregaon',
  'Kandivali',
];

const PropertyList = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedFurnishing, setSelectedFurnishing] = useState('All');
  const [maxPrice, setMaxPrice] = useState(100000);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/properties');
      const data = await res.json();
      if (Array.isArray(data)) {
        setProperties(data);
      } else {
        setProperties([]);
      }
    } catch (err) {
      console.error('Error fetching properties:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  // Preset Locations + Database se aaye Dynamic Locations ka Combo
  const locations = useMemo(() => {
    const fetchedLocations = properties.map((p) => p.sub_location).filter(Boolean);
    const combinedSet = new Set([...PRESET_LOCATIONS, ...fetchedLocations]);
    return ['All', ...Array.from(combinedSet)];
  }, [properties]);

  // Filter Logic
  const filteredProperties = useMemo(() => {
    return properties.filter((item) => {
      const price = item.actual_rent || item.price || item.asked_price || 0;
      const title = (item.title || '').toLowerCase();
      const location = (item.sub_location || '').toLowerCase();
      const search = searchTerm.toLowerCase();

      const matchesSearch = title.includes(search) || location.includes(search);
      const matchesLocation =
        selectedLocation === 'All' ||
        (item.sub_location || '').toLowerCase() === selectedLocation.toLowerCase();
      const matchesType = selectedType === 'All' || item.property_type === selectedType;
      const matchesFurnishing =
        selectedFurnishing === 'All' || item.furnishing === selectedFurnishing;
      const matchesPrice = price <= maxPrice;

      return matchesSearch && matchesLocation && matchesType && matchesFurnishing && matchesPrice;
    });
  }, [properties, searchTerm, selectedLocation, selectedType, selectedFurnishing, maxPrice]);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedLocation('All');
    setSelectedType('All');
    setSelectedFurnishing('All');
    setMaxPrice(100000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07090e] text-white flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-indigo-400 to-teal-300">
              Available Properties
            </h1>
            <p className="text-slate-400 text-xs mt-1">
              Explore fair rent listings with real-time filters across locations
            </p>
          </div>
          <button
            onClick={fetchProperties}
            className="px-4 py-2 bg-[#131926] hover:bg-slate-800 text-xs font-semibold rounded-xl text-slate-200 border border-slate-700 transition-all flex items-center gap-1.5"
          >
            🔄 Refresh List
          </button>
        </div>

        {/* Search & Filter Control Bar */}
        <div className="bg-[#0d111a] border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full lg:w-1/3">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search title, area, keyword..."
                className="w-full bg-[#131926] border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Dropdown Filters */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex gap-3 w-full lg:w-auto">
              {/* Location Filter (All Preset + Dynamic Areas Included) */}
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="bg-[#131926] border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none"
              >
                <option value="All">📍 All Area Locations</option>
                {locations
                  .filter((loc) => loc !== 'All')
                  .map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
              </select>

              {/* Property Type Filter */}
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="bg-[#131926] border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none"
              >
                <option value="All">🏠 All Property Types</option>
                <option value="1BHK">1BHK</option>
                <option value="2BHK">2BHK</option>
                <option value="3BHK">3BHK</option>
                <option value="PG / Room">PG / Room</option>
              </select>

              {/* Furnishing Filter */}
              <select
                value={selectedFurnishing}
                onChange={(e) => setSelectedFurnishing(e.target.value)}
                className="bg-[#131926] border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none"
              >
                <option value="All">🛋️ All Furnishing</option>
                <option value="Unfurnished">Unfurnished</option>
                <option value="Semi-Furnished">Semi-Furnished</option>
                <option value="Fully-Furnished">Fully-Furnished</option>
              </select>

              {/* Reset Button */}
              <button
                onClick={resetFilters}
                className="px-3 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-1"
                title="Reset Filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            </div>
          </div>

          {/* Max Price Range Slider */}
          <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row items-center gap-4 justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Filter className="w-3.5 h-3.5 text-indigo-400" />
              <span>Max Rent Budget:</span>
              <span className="font-semibold text-emerald-400">
                ₹{Number(maxPrice).toLocaleString('en-IN')}
              </span>
            </div>
            <input
              type="range"
              min="5000"
              max="100000"
              step="2000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full sm:w-64 accent-indigo-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Results Counter */}
        <p className="text-xs text-slate-400 px-1">
          Showing <span className="text-slate-200 font-semibold">{filteredProperties.length}</span> of {properties.length} listings
        </p>

        {/* Property Cards Grid */}
        {filteredProperties.length === 0 ? (
          <div className="bg-[#0d111a] border border-slate-800 p-10 rounded-2xl text-center text-slate-400">
            No properties match your filter criteria.{' '}
            <button onClick={resetFilters} className="text-indigo-400 underline font-semibold ml-1">
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <PropertyCard key={property._id || property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyList;