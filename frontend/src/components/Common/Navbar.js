import React from "react";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { FaBell } from "react-icons/fa"; // Import the notification icon

const Navbar = () => {
  const { user, logout } = useAuth();
  const logoUrl =
    "https://png.pngitem.com/pimgs/s/214-2145556_deloitte-logo-png-white-transparent-png.png"; // Deloitte logo URL

  return (
    <nav className="bg-deloitte-blue text-deloitte-white p-2 flex justify-between items-center sticky-navbar">
      <div className="flex items-center">
        <img src={logoUrl} alt="Deloitte Logo" className="h-8 mr-4" />{" "}
        {/* Deloitte Logo */}
        <span className="text-lg font-bold">Project Management Tool</span>{" "}
        {/* Project Management Tool text */}
      </div>
      <ul className="flex space-x-4 text-sm"></ul>
      <div className="text-sm flex items-center">
        {user ? (
          <>
            <FaBell className="text-deloitte-white hover:text-deloitte-cyan mr-4 cursor-pointer" />{" "}
            {/* Notification icon */}
            <span className="mr-2">{user.username}</span>
            <button
              onClick={logout}
              className="bg-deloitte-green hover:bg-deloitte-cyan text-deloitte-black px-2 py-1 rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="hover:text-deloitte-cyan">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
