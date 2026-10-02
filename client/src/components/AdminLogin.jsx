import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Simple Hardcoded Demo Admin Credentials
    if (email === 'admin@rentsense.com' && password === 'admin123') {
      localStorage.setItem('isAdminAuthenticated', 'true');
      navigate('/dashboard');
    } else {
      setError('❌ Invalid Admin Email or Password');
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#0d111a] border border-slate-800 rounded-2xl p-8 shadow-2xl">
        <h2 className="text-2xl font-bold text-center mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-indigo-400 to-teal-300">
          Admin Portal Login
        </h2>
        <p className="text-slate-400 text-center text-xs mb-6">
          Authorized personnel only. Access analytics & moderation.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase">
              Admin Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@rentsense.com"
              required
              className="w-full bg-[#131926] border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full bg-[#131926] border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-purple-600 via-indigo-600 to-teal-500 rounded-xl font-semibold text-sm text-white hover:opacity-95 transition-all shadow-lg mt-2"
          >
            Authenticate Admin
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-500">
          Demo Credentials: <span className="text-slate-300 font-mono">admin@rentsense.com</span> / <span className="text-slate-300 font-mono">admin123</span>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;