import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    localStorage.clear();
    navigate("/login");
  };

  if (!user) {
    return null; // Don't show navbar on login/signup pages
  }

  return (
    <>
      {/* Top Navigation Bar */}
      <nav className="bg-gradient-to-r from-green-600 to-green-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo/Brand */}
            <Link to={user?.role === "ADMIN" ? "/admin" : "/student"} className="text-2xl font-bold">
              Sportsteria
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              <Link
                to={user?.role === "ADMIN" ? "/admin" : "/student"}
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition"
              >
                Dashboard
              </Link>

              {user?.role === "ADMIN" && (
                <>
                  <Link
                    to="/admin"
                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition"
                  >
                    Equipment Management
                  </Link>
                  <Link
                    to="/admin"
                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition"
                  >
                    Request Approvals
                  </Link>
                </>
              )}

              {user?.role === "STUDENT" && (
                <>
                  <Link
                    to="/student"
                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition"
                  >
                    Browse Equipment
                  </Link>
                  <Link
                    to="/student"
                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition"
                  >
                    My Requests
                  </Link>
                </>
              )}
            </div>

            {/* User Menu */}
            <div className="hidden md:flex items-center space-x-4">
              <span className="text-sm font-medium">
                {user?.name} ({user?.role})
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white font-medium transition"
              >
                Logout
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-white focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-blue-700 px-2 pt-2 pb-3 space-y-1">
            <Link
              to={user?.role === "ADMIN" ? "/admin" : "/student"}
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-600 transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>

            {user?.role === "ADMIN" && (
              <>
                <Link
                  to="/admin"
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-600 transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Equipment Management
                </Link>
                <Link
                  to="/admin"
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-600 transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Request Approvals
                </Link>
              </>
            )}

            {user?.role === "STUDENT" && (
              <>
                <Link
                  to="/student"
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-600 transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Browse Equipment
                </Link>
                <Link
                  to="/student"
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-600 transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Requests
                </Link>
              </>
            )}

            <button
              onClick={() => {
                handleLogout();
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium bg-red-600 hover:bg-red-700 text-white transition"
            >
              Logout
            </button>
          </div>
        )}
      </nav>

      {/* Sidebar for Desktop */}
      <div className="hidden lg:block fixed left-0 top-16 h-screen w-64 bg-gray-50 border-r border-gray-200 overflow-y-auto">
        <div className="p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Navigation</h3>
          <ul className="space-y-3">
            <li>
              <Link
                to={user?.role === "ADMIN" ? "/admin" : "/student"}
                className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-100 rounded-lg transition font-medium"
              >
                📊 Dashboard
              </Link>
            </li>

            {user?.role === "ADMIN" && (
              <>
                <li className="pt-4 border-t border-gray-300">
                  <p className="text-xs font-bold text-gray-500 uppercase px-4 mb-2">Admin Functions</p>
                </li>
                <li>
                  <Link
                    to="/admin"
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-100 rounded-lg transition"
                  >
                    🏋️ Equipment Management
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin"
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-100 rounded-lg transition"
                  >
                    ✅ Request Approvals
                  </Link>
                </li>
              </>
            )}

            {user?.role === "STUDENT" && (
              <>
                <li className="pt-4 border-t border-gray-300">
                  <p className="text-xs font-bold text-gray-500 uppercase px-4 mb-2">Student Functions</p>
                </li>
                <li>
                  <Link
                    to="/student"
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-100 rounded-lg transition"
                  >
                    🏪 Browse Equipment
                  </Link>
                </li>
                <li>
                  <Link
                    to="/student"
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-100 rounded-lg transition"
                  >
                    📋 My Requests
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </>
  );
}
