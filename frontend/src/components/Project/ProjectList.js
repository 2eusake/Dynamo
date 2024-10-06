// src/components/ProjectList.js

import React, { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import apiClient from "../../utils/apiClient";
import { AuthContext } from "../../contexts/AuthContext";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "../UIComp";
import { ProjectContext } from "../../contexts/ProjectContext";
import { useTheme } from '../../contexts/ThemeContext'; // Import the theme context
import './Projects.css';

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const { user } = useContext(AuthContext);
  const { isDarkMode, toggleDarkMode } = useTheme(); // Use the context
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedProjects, setExpandedProjects] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        let response;
        if (user.role === "Director") {
          response = await apiClient.get("/projects");
        } else if (user.role === "Project Manager") {
          response = await apiClient.get(`/projects/manager/${user.id}`);
        } else {
          response = await apiClient.get(`/projects/user/${user.id}`);
        }
        setProjects(response.data);
        setError(null);
      } catch (error) {
        console.error("Failed to load projects:", error);
        setError("Failed to load projects. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, [user]);

  const toggleProjectExpansion = (projectId) => {
    setExpandedProjects((prev) => ({
      ...prev,
      [projectId]: !prev[projectId],
    }));
  };

  if (loading)
    return (
      <div className="text-center py-4">
        <span className="text-gray-500">Loading projects...</span>
      </div>
    );
  if (error)
    return (
      <div className="text-red-500 text-center py-4">Error: {error}</div>
    );

  return (
    
    <div
      className={`mx-auto p-4 ${
        isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
      } min-h-screen`}
    >
      <h3 className= {` text-2xl font-bold mb-4 underline-green ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`} >
   
        {user.role === "Director" ? "All Projects" : "Your Projects"}
      </h3>
      {projects.length === 0 ? (
        <p className="text-gray-500">No projects found.</p>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className={`border rounded-lg shadow-sm ${
                isDarkMode ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <div
                className={`flex justify-between items-center p-4 cursor-pointer ${
                  isDarkMode
                    ? "bg-gray-700 hover:bg-gray-600"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
                onClick={() => toggleProjectExpansion(project.id)}
              >
                {/* Project Info */}
                <div>
                  <h4 className="text-lg font-semibold">{project.name}</h4>
                  <p className="text-sm text-gray-500">
                    WBS Element: {project.wbsElement}
                  </p>
                </div>

                {/* Status and Due Date */}
                <div className="text-right">
                  <p className="text-sm">
                    Status:{" "}
                    <span
                      className={`font-semibold ${
                        project.status === "Completed"
                          ? "text-green-600"
                          : project.status === "In Progress"
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {project.status}
                    </span>
                  </p>
                  <p className="text-sm">
                    Due:{" "}
                    {project.endDate
                      ? new Date(project.endDate).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>

                {/* Chevron Icon */}
                {expandedProjects[project.id] ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </div>

              {/* Expanded Project Details */}
              {expandedProjects[project.id] && (
                <div
                  className={`p-4 ${
                    isDarkMode ? "bg-gray-700" : "bg-gray-50"
                  } border-t border-gray-300`}
                >
                  {/* View Details Button */}
                  <Link to={`/projects/${project.id}`}>
                    <Button variant="outline" className="mt-2">
                      View Details
                    </Button>
                  </Link>

                  {/* Tasks List */}
                  <h5 className="font-semibold mb-2 mt-4">Tasks:</h5>
                  {project.tasks && project.tasks.length > 0 ? (
                    <ul className="space-y-2">
                      {project.tasks.map((task) => (
                        <li
                          key={task.id}
                          className={`p-3 rounded border ${
                            isDarkMode
                              ? "bg-gray-600 border-gray-500"
                              : "bg-white border-gray-200"
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-medium">
                              {task.taskName || "Unnamed Task"}
                            </span>
                            {task.id ? (
                              <Link to={`/tasks/${task.id}`}>
                                <Button variant="outline" size="sm">
                                  View Details
                                </Button>
                              </Link>
                            ) : (
                              <Button variant="outline" size="sm" disabled>
                                Details Unavailable
                              </Button>
                            )}
                          </div>
                          {/* Task Status */}
                          <p className="text-sm text-gray-500 mt-1">
                            Status:{" "}
                            <span
                              className={`font-semibold ${
                                task.status === "Completed"
                                  ? "text-green-600"
                                  : task.status === "In Progress"
                                  ? "text-yellow-600"
                                  : "text-red-600"
                              }`}
                            >
                              {task.status || "Unknown"}
                            </span>
                          </p>
                          {/* Assigned User */}
                          <p className="text-sm text-gray-500 mt-1">
                            Assigned to:{" "}
                            {task.assignedToUser
                              ? task.assignedToUser.username
                              : "Unassigned"}
                          </p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">
                      No tasks found for this project.
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectList;
