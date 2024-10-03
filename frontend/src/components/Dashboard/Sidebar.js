
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaProjectDiagram,
  FaTasks,
  FaPlusCircle,
  FaChartBar,
  FaCog,
  FaBars,
  FaBell,
} from "react-icons/fa";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const menuItems = [
    { name: "Dashboard", icon: FaTachometerAlt, path: "/dashboard" },
    { name: "Projects", icon: FaProjectDiagram, path: "/projects" },
    { name: "Tasks", icon: FaTasks, path: "/tasks" },
    { name: "Create Project", icon: FaPlusCircle, path: "/create-project" },
    { name: "Reports", icon: FaChartBar, path: "/reports" },
    { name: "Settings", icon: FaCog, path: "/settings" },
    {name:"Notification", icon: FaBell}
  ];

  return (
    <div
      className={`fixed top-0 left-0 h-full bg-white border-r border-gray-200 shadow-sm transition-all duration-300 ease-in-out z-50 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 h-16 border-b border-gray-200">
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
          className="text-gray-800 focus:outline-none"
        >
          <FaBars size={20} />
        </button>
      </div>

      {/* Sidebar Menu */}
      <nav className="mt-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`flex items-center p-2 text-base font-medium rounded-md mx-2 ${
                    isActive
                      ? "bg-deloitte-green text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon
                    className={`flex-shrink-0 ${
                      isActive ? "text-white" : "text-gray-500"
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

