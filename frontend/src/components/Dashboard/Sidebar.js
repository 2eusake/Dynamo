// import React, { useState } from "react";

// import { Link } from "react-router-dom";

// import {
//   FaTachometerAlt,
//   FaProjectDiagram,
//   FaTasks,
//   FaPlusCircle,
//   FaChartBar,

//   //FaUsersCog,//
//   FaCog,
//   FaBars,
// } from "react-icons/fa"; // Import icons

// const Sidebar = () => {
//   const [isCollapsed, setIsCollapsed] = useState(false);

//   const toggleSidebar = () => {
//     setIsCollapsed(!isCollapsed);
//   };

//   return (
//     <div
//       className={`sidebar bg-white text-deloitte-dark-green min-h-full p-2 flex flex-col fixed ${
//         isCollapsed ? "w-16" : "w-56"
//       } transition-width duration-300 ease-in-out shadow-lg`}
//     >
//       <div className="flex justify-between items-center mb-4">
//         <button
//           onClick={toggleSidebar}
//           className="text-deloitte-dark-green focus:outline-none"
//         >
//           <FaBars />
//         </button>
//       </div>

//       <ul className="space-y-2 text-sm">
//         <li>
//           <Link
//             to="/dashboard"
//             className="flex items-center hover:text-deloitte-cyan"
//           >
//             <FaTachometerAlt className="mr-2" />

//             {!isCollapsed && <span>Dashboard</span>}
//           </Link>
//         </li>

//         <li>
//           <Link
//             to="/projects"
//             className="flex items-center hover:text-deloitte-cyan"
//           >
//             <FaProjectDiagram className="mr-2" />

//             {!isCollapsed && <span>Projects</span>}
//           </Link>
//         </li>

//         <li>
//           <Link
//             to="/tasks"
//             className="flex items-center hover:text-deloitte-cyan"
//           >
//             <FaTasks className="mr-2" />

//             {!isCollapsed && <span>Tasks</span>}
//           </Link>
//         </li>

//         <li>
//           <Link
//             to="/create-project"
//             className="flex items-center hover:text-deloitte-cyan"
//           >
//             <FaPlusCircle className="mr-2" />

//             {!isCollapsed && <span>Create Project</span>}
//           </Link>
//         </li>

//         <li>
//           <Link
//             to="/reports"
//             className="flex items-center hover:text-deloitte-cyan"
//           >
//             <FaChartBar className="mr-2" />

//             {!isCollapsed && <span>Reports</span>}
//           </Link>
//         </li>

//         <li>
//           <Link
//             to="/settings"
//             className="flex items-center hover:text-deloitte-cyan"
//           >
//             <FaCog className="mr-2" />

//             {!isCollapsed && <span>Settings</span>}
//           </Link>
//         </li>
//       </ul>
//     </div>
//   );
// };

// export default Sidebar;
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

