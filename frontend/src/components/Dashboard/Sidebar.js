/*import React, { useState } from "react";
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

export default Sidebar;*/
import React, { useState } from "react";

import { Link } from "react-router-dom";

import {

  FaTachometerAlt,

  FaProjectDiagram,

  FaTasks,

  FaPlusCircle,

  FaChartBar,

  //FaUsersCog,//

  FaCog,

  FaBars,

} from "react-icons/fa"; // Import icons

 

const Sidebar = () => {

  const [isCollapsed, setIsCollapsed] = useState(false);

 

  const toggleSidebar = () => {

    setIsCollapsed(!isCollapsed);

  };

 

  return (

    <div

      className={`sidebar bg-white text-deloitte-dark-green min-h-full p-2 flex flex-col fixed ${

        isCollapsed ? "w-16" : "w-56"

      } transition-width duration-300 ease-in-out shadow-lg`}

    >

      <div className="flex justify-between items-center mb-4">

        <button

          onClick={toggleSidebar}

          className="text-deloitte-dark-green focus:outline-none"

        >

          <FaBars />

        </button>

      </div>

      <ul className="space-y-2 text-sm">

        <li>

          <Link

            to="/dashboard"

            className="flex items-center hover:text-deloitte-cyan"

          >

            <FaTachometerAlt className="mr-2" />

            {!isCollapsed && <span>Dashboard</span>}

          </Link>

        </li>

        <li>

          <Link

            to="/projects"

            className="flex items-center hover:text-deloitte-cyan"

          >

            <FaProjectDiagram className="mr-2" />

            {!isCollapsed && <span>Projects</span>}

          </Link>

        </li>

        <li>

          <Link

            to="/tasks"

            className="flex items-center hover:text-deloitte-cyan"

          >

            <FaTasks className="mr-2" />

            {!isCollapsed && <span>Tasks</span>}

          </Link>

        </li>

        <li>

          <Link

            to="/create-project"

            className="flex items-center hover:text-deloitte-cyan"

          >

            <FaPlusCircle className="mr-2" />

            {!isCollapsed && <span>Create Project</span>}

          </Link>

        </li>

        <li>

          <Link

            to="/reports"

            className="flex items-center hover:text-deloitte-cyan"

          >

            <FaChartBar className="mr-2" />

            {!isCollapsed && <span>Reports</span>}

          </Link>

        </li>

        <li>

          <Link

            to="/settings"

            className="flex items-center hover:text-deloitte-cyan"

          >

            <FaCog className="mr-2" />

            {!isCollapsed && <span>Settings</span>}

          </Link>

        </li>

      </ul>

    </div>

  );

};

 

export default Sidebar;
