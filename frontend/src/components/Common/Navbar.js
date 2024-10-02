import React from "react";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth"; // Custom hook for authentication context
import { FaBell } from "react-icons/fa"; // Import the notification icon

const Navbar = () => {
  const { user, handleLogout } = useAuth(); // Use the correct function name: handleLogout

  const logoUrl =
    "https://s3.amazonaws.com/company-photo.theladders.com/17064/fec5ed0f-31ae-46f8-b7e1-6b09b01c6714.png"; // Deloitte logo URL

  return (
    <nav className="bg-white text-deloitte-dark-green p-2 flex justify-between items-center shadow-md sticky-navbar">
      <div className="flex items-center">
        <img src={logoUrl} alt="Deloitte Logo" className="h-8 mr-4" />
        <div className="Dynamo">
          <span className="text-lg font-bold">Dynamo</span>
        </div>
      </div>
      <ul className="flex space-x-4 text-sm"></ul>
      <div className="text-sm flex items-center">
        {user ? (
          <>
            <FaBell className="text-deloitte-dark-green hover:text-deloitte-cyan mr-4 cursor-pointer" />
            <span className="mr-2">{user.username}</span>
            <button
              onClick={handleLogout} // Ensure you call handleLogout, not logout
              className="bg-deloitte-dark-green hover:bg-deloitte-cyan text-white px-2 py-1 rounded"
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
