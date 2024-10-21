import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaUserCircle } from "react-icons/fa";
import { AuthContext } from "../../contexts/AuthContext";
import { useTheme } from '../../contexts/ThemeContext';

const Navbar = ({ onSidebarToggle }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { user, handleLogout } = useContext(AuthContext);
  const { isDarkMode } = useTheme();
  const logoUrl =
    "https://s3.amazonaws.com/company-photo.theladders.com/17064/fec5ed0f-31ae-46f8-b7e1-6b09b01c6714.png";

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-16 px-6">
      {/* Left Section: Sidebar toggle and Logo */}
      <div className="flex items-center space-x-4">
        <button
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-full focus:outline-none transition-colors duration-200"
          onClick={onSidebarToggle}
        >
          <FaBars size={20} />
        </button>
        <img src={logoUrl} alt="Deloitte Logo" className="h-8" />
      </div>

      {/* Right Section: User Profile */}
      <div className="flex items-center space-x-6">
        {user ? (
          <div className="flex items-center space-x-2">
            <Link to="/settings">
              <FaUserCircle size={28} className="text-gray-600 cursor-pointer" />
            </Link>
            <Link to="/settings">
              <span className="text-gray-600 font-medium cursor-pointer">{user.username}</span>
            </Link>
            <button
              className="bg-deloitte-green hover:bg-deloitte-cyan text-white px-4 py-2 rounded-full transition-colors duration-200"
              onClick={handleLogout}
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
