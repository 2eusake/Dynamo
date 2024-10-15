import React, { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import apiClient from "../../utils/apiClient";
import { AuthContext } from "../../contexts/AuthContext";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "../UIComp";
import { useTheme } from '../../contexts/ThemeContext'; // Import the theme context
import './Projects.css';

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const { user } = useContext(AuthContext);
  const { isDarkMode } = useTheme(); // Use the theme context
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedProjects, setExpandedProjects] = useState({});
  const [filter, setFilter] = useState("all"); // State for filtering projects
  const navigate = useNavigate();

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        let response;

        if (user.role === "Director" || user.role === "Project Manager") {
          if (filter === "assigned") {
            response = await apiClient.get("/projects?filter=assigned");
          } else {
            response = await apiClient.get("/projects");
          }
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
  }, [user, filter]);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

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
      <h3 className={`text-2xl font-bold mb-4 underline-green ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
        {user.role === "Director" ? "All Projects" : "Your Projects"}
      </h3>

      {/* Filter Component */}
      {(user.role === "Director" || user.role === "Project Manager") && (
        <div className="mb-4">
          <label htmlFor="filter" className="mr-2">
            Filter Projects:
          </label>
          <select
            id="filter"
            value={filter}
            onChange={handleFilterChange}
            className={`p-2 rounded border ${isDarkMode ? "bg-gray-700 border-gray-500 text-white" : "bg-white border-gray-300 text-black"}`}
          >
            <option value="all">All Projects</option>
            <option value="assigned">Assigned Projects</option>
          </select>
        </div>
      )}

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
                  <p className="text-sm text-gray-500">
                    Director: {project.projectDirector ? project.projectDirector.username : "Not Assigned"}
                  </p>
                  <p className="text-sm text-gray-500">
                    Project Manager: {project.projectManager ? project.projectManager.username : "Not Assigned"}
                  </p>
                  <p className="text-sm text-gray-500">
                    Task Count: {project.tasks ? project.tasks.length : 0}
                  </p>
                </div>

                {/* Status, Progress, and Due Date */}
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
                  {/* Progress Bar */}
                  <div className="mt-2">
                    <div className="w-full bg-gray-300 rounded-full h-2.5">
                      <div
                        className="bg-green-600 h-2.5 rounded-full"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Progress: {project.progress}%
                    </p>
                  </div>
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
