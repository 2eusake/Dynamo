import React from "react";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { FaBell } from "react-icons/fa";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img
          src="https://s3.amazonaws.com/company-photo.theladders.com/17064/fec5ed0f-31ae-46f8-b7e1-6b09b01c6714.png"
          alt="Deloitte Logo"
        />
        <span>Dynamo</span>
      </div>
      <div className="navbar-links">
        {user ? (
          <>
            <FaBell className="navbar-icon" />
            <span>{user.username}</span>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
