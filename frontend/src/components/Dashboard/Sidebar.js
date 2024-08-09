import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="sidebar bg-deloitte-blue text-deloitte-white w-48 p-2 flex flex-col">
      <ul className="space-y-2 text-sm">
        <li>
          <Link to="/dashboard" className="hover:text-deloitte-cyan">Dashboard</Link>
        </li>
        <li>
          <Link to="/projects" className="hover:text-deloitte-cyan">Projects</Link>
        </li>
        <li>
          <Link to="/tasks" className="hover:text-deloitte-cyan">Tasks</Link>
        </li>
        <li>
          <Link to="/create-project" className="hover:text-deloitte-cyan">Create Project</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
