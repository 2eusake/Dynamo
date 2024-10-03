
import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaSearch, FaUserCircle } from "react-icons/fa";
import { AuthContext } from "../../contexts/AuthContext"; // Import your authentication context

const Navbar = ({ onSidebarToggle }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useContext(AuthContext); // Replace with actual user data

  const logoUrl =
    "https://s3.amazonaws.com/company-photo.theladders.com/17064/fec5ed0f-31ae-46f8-b7e1-6b09b01c6714.png"; // Deloitte logo placeholder

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-16 px-6">
      {/* Left Section: Sidebar toggle and Logo */}
      <div className="flex items-center space-x-4">
        <button
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-full focus:outline-none transition-colors duration-200"
          onClick={onSidebarToggle} // Toggle Sidebar
        >
          <FaBars size={20} />
        </button>
        <img src={logoUrl} alt="Deloitte Logo" className="h-8" />
      </div>

      {/* Center Section: Search Bar */}
      <div className="flex-1 max-w-2xl mx-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-deloitte-cyan"
          />
          <FaSearch className="absolute right-4 top-3 text-gray-400" />
        </div>
      </div>

      {/* Right Section: User Profile */}
      <div className="flex items-center space-x-6">
        {/* User Profile */}
        {user ? (
          <div className="flex items-center space-x-2">
            <FaUserCircle size={28} className="text-gray-600" />
            <span className="text-gray-600 font-medium">{user.username}</span>
            <button
              className="bg-deloitte-dark-green hover:bg-deloitte-cyan text-white px-4 py-2 rounded-full transition-colors duration-200"
              onClick={() => console.log("Logout")} // Replace with actual logout function
            >
              Logout
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="bg-deloitte-dark-green hover:bg-deloitte-cyan text-white px-4 py-2 rounded-full transition-colors duration-200"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
