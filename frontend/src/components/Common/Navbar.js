import React from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-deloitte-blue text-deloitte-white p-2 flex justify-between items-center sticky-navbar">
      <ul className="flex space-x-4 text-sm">
        <li>
          <Link to="/projects" className="hover:text-deloitte-cyan">Projects</Link>
        </li>
        <li>
          <Link to="/tasks" className="hover:text-deloitte-cyan">Tasks</Link>
        </li>
        <li>
          <Link to="/reports" className="hover:text-deloitte-cyan">Reports</Link>
        </li>
        <li>
          <Link to="/team-management" className="hover:text-deloitte-cyan">Team Management</Link>
        </li>
        <li>
          <Link to="/settings" className="hover:text-deloitte-cyan">Settings</Link>
        </li>
      </ul>
      <div className="text-sm">
        {user ? (
          <>
            <span className="mr-2">{user.username}</span>
            <button onClick={logout} className="bg-deloitte-green hover:bg-deloitte-cyan text-deloitte-black px-2 py-1 rounded">
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="hover:text-deloitte-cyan">Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
