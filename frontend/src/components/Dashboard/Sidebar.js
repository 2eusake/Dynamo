import React from "react";
import { Link } from "react-router-dom";
import {
  FaTachometerAlt,
  FaProjectDiagram,
  FaTasks,
  FaPlusCircle,
  FaChartBar,
  FaUsersCog,
  FaCog,
} from "react-icons/fa"; // Import icons

const Sidebar = () => {
  return (
    <div className="sidebar bg-deloitte-blue text-deloitte-white min-h-full p-2 flex flex-col fixed">
      <ul className="space-y-2 text-sm">
        <li>
          <Link
            to="/dashboard"
            className="flex items-center hover:text-deloitte-cyan"
          >
            <FaTachometerAlt className="mr-2" /> {/* Icon for Dashboard */}
            Dashboard
          </Link>
        </li>
        <li>
          <Link
            to="/projects"
            className="flex items-center hover:text-deloitte-cyan"
          >
            <FaProjectDiagram className="mr-2" /> {/* Icon for Projects */}
            Projects
          </Link>
        </li>
        <li>
          <Link
            to="/tasks"
            className="flex items-center hover:text-deloitte-cyan"
          >
            <FaTasks className="mr-2" /> {/* Icon for Tasks */}
            Tasks
          </Link>
        </li>
        <li>
          <Link
            to="/create-project"
            className="flex items-center hover:text-deloitte-cyan"
          >
            <FaPlusCircle className="mr-2" /> {/* Icon for Create Project */}
            Create Project
          </Link>
        </li>
        <li>
          <Link
            to="/reports"
            className="flex items-center hover:text-deloitte-cyan"
          >
            <FaChartBar className="mr-2" /> {/* Icon for Reports */}
            Reports
          </Link>
        </li>
        <li>
          <Link
            to="/team-management"
            className="flex items-center hover:text-deloitte-cyan"
          >
            <FaUsersCog className="mr-2" /> {/* Icon for Team Management */}
            Team Management
          </Link>
        </li>
        <li>
          <Link
            to="/settings"
            className="flex items-center hover:text-deloitte-cyan"
          >
            <FaCog className="mr-2" /> {/* Icon for Settings */}
            Settings
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
