import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaTachometerAlt,
  FaProjectDiagram,
  FaTasks,
  FaPlusCircle,
  FaChartBar,
  FaCog,
  FaBars,
} from "react-icons/fa";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <button className="toggle-btn" onClick={toggleSidebar}>
        <FaBars />
      </button>
      <nav>
        <Link to="/dashboard">
          <FaTachometerAlt />
          {!isCollapsed && 'Dashboard'}
        </Link>
        <Link to="/projects">
          <FaProjectDiagram />
          {!isCollapsed && 'Projects'}
        </Link>
        <Link to="/tasks">
          <FaTasks />
          {!isCollapsed && 'Tasks'}
        </Link>
        <Link to="/create-project">
          <FaPlusCircle />
          {!isCollapsed && 'Create Project'}
        </Link>
        <Link to="/reports">
          <FaChartBar />
          {!isCollapsed && 'Reports'}
        </Link>
        <Link to="/settings">
          <FaCog />
          {!isCollapsed && 'Settings'}
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
