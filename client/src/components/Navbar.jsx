import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";
import { FaCalculator, FaBuilding, FaPlusCircle, FaChartBar } from "react-icons/fa";

const links = [
  { to: "/", label: "Calculator", icon: FaCalculator },
  { to: "/properties", label: "Properties", icon: FaBuilding },
  { to: "/list-property", label: "List Property", icon: FaPlusCircle },
  { to: "/admin", label: "Dashboard", icon: FaChartBar },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <nav className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-lg border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-extrabold bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
              RentSense
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {links.map(({ to, label, icon: Icon }) => {
              const active = pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? "bg-primary-600/20 text-primary-400"
                      : "text-gray-400 hover:text-gray-100 hover:bg-gray-800"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              );
            })}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 text-gray-400 hover:text-white"
            onClick={() => setOpen(!open)}
          >
            {open ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-gray-800 bg-gray-900">
          {links.map(({ to, label, icon: Icon }) => {
            const active = pathname === to;
            return (
              <Link
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors ${
                  active
                    ? "bg-primary-600/20 text-primary-400"
                    : "text-gray-400 hover:text-gray-100 hover:bg-gray-800"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}
