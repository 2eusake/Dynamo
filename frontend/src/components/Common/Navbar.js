import React, { useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import {
  FaBell,
  FaBars,
  FaTachometerAlt,
  FaProjectDiagram,
  FaTasks,
  FaPlusCircle,
  FaChartBar,
  FaCog,
  FaSearch,
  FaUserCircle,
} from "react-icons/fa";

const NavbarWithSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, logout } = useAuth();

  const logoUrl =
    "https://s3.amazonaws.com/company-photo.theladders.com/17064/fec5ed0f-31ae-46f8-b7e1-6b09b01c6714.png";

  const sidebarItems = [
    { icon: FaTachometerAlt, text: "Dashboard", link: "/dashboard" },
    { icon: FaProjectDiagram, text: "Projects", link: "/projects" },
    { icon: FaTasks, text: "Tasks", link: "/tasks" },
    { icon: FaPlusCircle, text: "Create Project", link: "/create-project" },
    { icon: FaChartBar, text: "Reports", link: "/reports" },
    { icon: FaCog, text: "Settings", link: "/settings" },
  ];

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`bg-white text-deloitte-dark-green h-full transition-all duration-300 ease-in-out fixed left-0 top-0 ${
          isCollapsed ? "w-16" : "w-56"
        } shadow-lg pt-16`}
      >
        <div className="flex flex-col h-full">
          {sidebarItems.map((item, index) => (
            <Link
              key={index}
              to={item.link}
              className="flex items-center px-4 py-3 text-sm hover:bg-gray-100 transition-colors duration-200"
            >
              <item.icon className={`${isCollapsed ? "mx-auto" : "mr-3"}`} />
              {!isCollapsed && <span>{item.text}</span>}
            </Link>
          ))}
        </div>
      </div>

      {/* Main content area */}
      <div
        className={`flex-1 ${
          isCollapsed ? "ml-16" : "ml-56"
        } transition-all duration-300`}
      >
        {/* Navbar */}
        <nav className="bg-white text-deloitte-dark-green p-4 flex justify-between items-center shadow-md fixed top-0 right-0 left-0 z-10">
          <div className="flex items-center">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <FaBars />
            </button>
            <img src={logoUrl} alt="Deloitte Logo" className="h-8 ml-4" />
            <span className="text-lg font-bold ml-4">Dynamo</span>
          </div>

          <div className="flex-1 max-w-xl mx-4">
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

          {user ? (
            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200">
                <FaBell />
              </button>
              <div className="flex items-center">
                <FaUserCircle className="text-xl mr-2" />
                <span className="text-sm font-medium">{user.username}</span>
              </div>
              <button
                onClick={logout}
                className="bg-deloitte-dark-green hover:bg-deloitte-cyan text-white px-4 py-2 rounded-full transition-colors duration-200"
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
        </nav>

        {/* Page content would go here */}
        <div className="p-4 mt-16">{/* Your page content */}</div>
      </div>
    </div>
  );
};

export default NavbarWithSidebar;
