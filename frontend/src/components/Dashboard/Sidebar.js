import React, { useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { useTheme } from '../../contexts/ThemeContext';
import {
  FaTachometerAlt,
  FaProjectDiagram,
  FaTasks,
  FaPlusCircle,
  FaChartBar,
  FaCog,
  FaBars,
  FaBell,
  FaUsers,
} from "react-icons/fa";
import { FaRegClock } from "react-icons/fa";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const { isDarkMode } = useTheme();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const menuItems = [
    {
      name: "Dashboard",
      icon: FaTachometerAlt,
      path: "/dashboard",
      allowedRoles: ["Consultant", "Project Manager", "Director"],
    },
    {
      name: "Create Project",
      icon: FaPlusCircle,
      path: "/create-project",
      allowedRoles: ["Project Manager", "Director"],
    },
    {
      name: "Projects",
      icon: FaProjectDiagram,
      path: "/projects",
      allowedRoles: ["Project Manager", "Director"],
    },

    {
      name: "Tasks",
      icon: FaTasks,
      path: "/tasks",
      allowedRoles: ["Consultant", "Project Manager", "Director"],
    },
    {
      name: "Timesheet",
      icon: FaRegClock,
      path: "/timesheet",
      allowedRoles: ["Project Manager", "Director"],
    },
    {
      name: "Reports",
      icon: FaChartBar,
      path: "/reports",
      allowedRoles: ["Project Manager", "Director"],
    },
    {
      name: "Teams", // New Teams page
      icon: FaUsers,
      path: "/teams",
      allowedRoles: ["Project Manager", "Director"], // Set allowed roles as per your requirement
    },
  
    {
      name: "Settings",
      icon: FaCog,
      path: "/settings",
      allowedRoles: ["Consultant", "Project Manager", "Director"],
    },
  ];

  if (!user) return null; // Don't render anything if user is not authenticated

  return (
    <div
      className={`fixed top-0 left-0 h-full transition-all duration-300 ease-in-out z-50 ${
        isCollapsed ? "w-20" : "w-64"
      } ${isDarkMode ? "bg-black text-white" : "bg-gray-100 text-gray-900"}`}
    >
      {/* Sidebar Header */}
      <div className={`flex items-center justify-between p-4 h-16 ${isDarkMode ? 'border-b border-gray-700' : 'border-b border-gray-200'}`}>
        {!isCollapsed && (
          <div className="flex items-center">
            <img
              src="https://s3.amazonaws.com/company-photo.theladders.com/17064/fec5ed0f-31ae-46f8-b7e1-6b09b01c6714.png"
              alt="Deloitte Logo"
              className="h-8 w-auto"
            />
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className={`focus:outline-none ${isDarkMode ? 'text-white' : 'text-gray-800'}`}
        >
          <FaBars size={20} />
        </button>
      </div>

      {/* Sidebar Menu */}
      <nav className="mt-4">
        <ul className="space-y-2">
          {menuItems
            .filter((item) => item.allowedRoles.includes(user.role))
            .map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className={`flex items-center p-2 text-base font-medium rounded-md mx-2 ${
                      isActive
                        ? "bg-deloitte-green text-white"
                        : isDarkMode
                        ? "text-gray-400 hover:bg-gray-800"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Icon
                      className={`flex-shrink-0 ${
                        isActive ? "text-white" : isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                      size={20}
                    />
                    {!isCollapsed && <span className="ml-3">{item.name}</span>}
                  </Link>
                </li>
              );
            })}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
