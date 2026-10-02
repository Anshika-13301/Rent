import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  Building2,
  IndianRupee,
  MapPin,
  TrendingUp,
  Trash2,
  LogOut,
  User,
  Phone,
} from 'lucide-react';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a4de6c'];

const Dashboard = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState('All');
  const navigate = useNavigate();

  // Backend se MongoDB Listed Properties Fetch Karna
  const fetchProperties = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/properties');
      const data = await res.json();
      if (Array.isArray(data)) {
        setProperties(data);
      }
    } catch (err) {
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  // Logout Handler
  const handleLogout = () => {
    localStorage.removeItem('isAdminAuthenticated');
    navigate('/admin-login');
  };

  // Property Delete Handler
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/properties/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setProperties((prev) => prev.filter((item) => item._id !== id));
      }
    } catch (err) {
      console.error('Failed to delete property', err);
    }
  };

  // ──────────────── Analytics Logic ────────────────
  const totalListings = properties.length;
  const avgRent =
    totalListings > 0
      ? Math.round(
          properties.reduce(
            (acc, curr) => acc + (curr.actual_rent || curr.price || 0),
            0
          ) / totalListings
        )
      : 0;

  // Chart Data 1: Location-wise Average Rent
  const locationMap = {};
  properties.forEach((item) => {
    const loc = item.sub_location || 'Other';
    if (!locationMap[loc]) {
      locationMap[loc] = { total: 0, count: 0 };
    }
    locationMap[loc].total += item.actual_rent || item.price || 0;
    locationMap[loc].count += 1;
  });

  const barChartData = Object.keys(locationMap).map((loc) => ({
    name: loc,
    avgRent: Math.round(locationMap[loc].total / locationMap[loc].count),
  }));

  // Chart Data 2: Property Type Distribution
  const typeMap = {};
  properties.forEach((item) => {
    const type = item.property_type || 'Other';
    typeMap[type] = (typeMap[type] || 0) + 1;
  });

  const pieChartData = Object.keys(typeMap).map((type) => ({
    name: type,
    value: typeMap[type],
  }));

  // Filtered Properties Table Data
  const filteredProperties =
    selectedLocation === 'All'
      ? properties
      : properties.filter((p) => p.sub_location === selectedLocation);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07090e] text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header with Admin Logout */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-indigo-400 to-teal-300">
              Analytics & Admin Dashboard
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Real-time insights into listed properties, market price trends, and ML analytics.
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-xl text-xs font-semibold transition-all shadow-sm"
          >
            <LogOut className="w-4 h-4" />
            Logout Admin
          </button>
        </div>

        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#0d111a] border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
            <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-400">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase">Total Listings</p>
              <p className="text-2xl font-bold text-white mt-1">{totalListings}</p>
            </div>
          </div>

          <div className="bg-[#0d111a] border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
            <div className="p-3 bg-teal-500/10 border border-teal-500/20 rounded-xl text-teal-400">
              <IndianRupee className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase">Average Rent</p>
              <p className="text-2xl font-bold text-white mt-1">
                ₹{avgRent.toLocaleString('en-IN')}
              </p>
            </div>
          </div>

          <div className="bg-[#0d111a] border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
            <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase">Sub-Locations</p>
              <p className="text-2xl font-bold text-white mt-1">
                {Object.keys(locationMap).length}
              </p>
            </div>
          </div>

          <div className="bg-[#0d111a] border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase">Market Demand</p>
              <p className="text-2xl font-bold text-emerald-400 mt-1">High (+12%)</p>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bar Chart */}
          <div className="lg:col-span-2 bg-[#0d111a] border border-slate-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-slate-200 mb-4">
              Average Rent by Sub-Location (₹)
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData}>
                  <XAxis dataKey="name" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#131926',
                      borderColor: '#334155',
                      borderRadius: '12px',
                    }}
                  />
                  <Bar dataKey="avgRent" fill="#6366f1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="bg-[#0d111a] border border-slate-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-slate-200 mb-4">
              Property Type Share
            </h3>
            <div className="h-64 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieChartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#131926',
                      borderColor: '#334155',
                      borderRadius: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Managed Properties Data Table */}
        <div className="bg-[#0d111a] border border-slate-800 rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h3 className="text-lg font-semibold text-slate-200">Manage Listed Properties</h3>

            {/* Location Filter */}
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="bg-[#131926] border border-slate-700 rounded-xl px-4 py-2 text-xs text-slate-300 focus:outline-none"
            >
              <option value="All">All Locations</option>
              {Object.keys(locationMap).map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-[#131926] text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="p-4 rounded-l-xl">Title / Location</th>
                  <th className="p-4">Owner Info</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Area (sqft)</th>
                  <th className="p-4">Rent (₹)</th>
                  <th className="p-4">Furnishing</th>
                  <th className="p-4 rounded-r-xl text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredProperties.length > 0 ? (
                  filteredProperties.map((item) => (
                    <tr key={item._id || item.id} className="hover:bg-slate-800/30 transition-all">
                      <td className="p-4">
                        <p className="font-semibold text-slate-200">
                          {item.title || `${item.property_type} in ${item.sub_location}`}
                        </p>
                        <p className="text-xs text-slate-500">{item.sub_location}</p>
                      </td>
                      <td className="p-4">
                        <p className="text-xs font-medium text-slate-200 flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-indigo-400" />
                          {item.owner_name || 'N/A'}
                        </p>
                        <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <Phone className="w-3 h-3 text-slate-500" />
                          {item.owner_contact || 'N/A'}
                        </p>
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-lg text-xs font-medium">
                          {item.property_type}
                        </span>
                      </td>
                      <td className="p-4">{item.area_sqft || item.area || '—'} sq ft</td>
                      <td className="p-4 font-semibold text-emerald-400">
                        ₹{(item.actual_rent || item.price || item.asked_price || 0).toLocaleString('en-IN')}
                      </td>
                      <td className="p-4 text-xs text-slate-400">
                        {item.furnishing || 'N/A'}
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleDelete(item._id || item.id)}
                          className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg transition-all border border-rose-500/20"
                          title="Delete Listing"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-slate-500 text-sm">
                      No property listings found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;