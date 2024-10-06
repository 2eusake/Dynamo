import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../utils/apiClient";
import { AuthContext } from "../../contexts/AuthContext";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../UIComp";
import { ProjectContext } from "../../contexts/ProjectContext";
import { useTheme } from '../../contexts/ThemeContext'; // Import the theme context

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

  // const navigateToProjectDetails = (projectId, event) => {
  //   event.stopPropagation();
  //   navigate(`/projects/${id}`);
  // };

  // const navigateToTaskDetails = (taskId, event) => {
  //   event.stopPropagation();
  //   navigate(`/tasks/${taskId}`);
  // };

  if (loading)
    return <div className="text-center py-4">Loading projects...</div>;
  if (error)
    return <div className="text-red-500 text-center py-4">Error: {error}</div>;

  return (
    <div className={` mx-auto p-4 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
    <div className={` mx-auto p-4 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
      <h3 className="text-2xl font-bold mb-4">
        {user.role === "Director" ? "All Projects" : "Your Projects"}
      </h3>
      {projects.length === 0 ? (
        <p className="text-gray-500">No projects found.</p>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => (
            <div key={project.id} className="border rounded-lg shadow-sm">
              <div
                className={` flex justify-between items-center p-4 cursor-pointer bg-black hover:bg-gray-600 ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}
                onClick={() => toggleProjectExpansion(project.id)}
              >
                <div>
                  <h4 className="text-lg font-semibold">{project.name}</h4>
                  <p className="text-sm text-gray-600">
                    WBS Element: {project.wbsElement}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm">
                    Status:{" "}
                    <span
                      className={`font-semibold ${
                        project.status === "Completed"
                          ? "text-green-600"
                          : "text-green-600"
                      }`}
                    >
                      {project.status}
                    </span>
                  </p>
                  <p className="text-sm">
                    Due: {new Date(project.endDate).toLocaleDateString()}
                  </p>
                </div>
                {expandedProjects[project.id] ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </div>
              {expandedProjects[project.id] && (
                <div className="p-4 border-t">
                  {project.id ? (
                    <Link to={`/projects/${project.id}`}>
                      <Button variant="outline" className="mt-2">
                        View Details
                      </Button>
                    </Link>
                  ) : (
                    <Button variant="outline" className="mt-2" disabled>
                      Details Unavailable
                    </Button>
                  )}
                  <h5 className="font-semibold mb-2">Tasks:</h5>
                  {project.tasks && project.tasks.length > 0 ? (
                    <ul className="space-y-2">
                      {project.tasks.map((task) => (
                        <li
                          key={task.id}
                          className="bg-white p-2 rounded border"
                        >
                          <div className="flex justify-between items-center">
                            <span>{task.taskName}</span>
                            {task.id ? (
                              <Link to={`/tasks/${task.id}`}>
                                <Button variant="outline" className="mt-2">
                                  View Details
                                </Button>
                              </Link>
                            ) : (
                              <Button
                                variant="outline"
                                className="mt-2"
                                disabled
                              >
                                Details Unavailable
                              </Button>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">
                            Status: {task.status}
                          </p>
                          <p className="text-sm text-gray-600">
                            Assigned to: {task.assignedTo}
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
    </div>
  );
};

export default ProjectList;
