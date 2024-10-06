// src/components/Project/ProjectDetails.js

import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import apiClient from "../../utils/apiClient";
import { useTheme } from '../../contexts/ThemeContext';
import { Calendar, Clock, User, Edit } from "lucide-react";
import {
  Button,
  Input,
  Textarea,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../UIComp"; // Ensure these components are available

const ProjectDetails = () => {
  const [project, setProject] = useState(null);
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isDarkMode, toggleDarkMode } = useTheme();

  // New state variables for editing
  const [isEditing, setIsEditing] = useState(false);
  const [editedProject, setEditedProject] = useState(null);
  const [projectManagers, setProjectManagers] = useState([]);
  const [directors, setDirectors] = useState([]);
  

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(`/projects/${id}`);
        setProject(response.data);
        setEditedProject(response.data); // Initialize editedProject with fetched data
        setError(null);
      } catch (err) {
        console.error("Failed to fetch project details:", err);
        setError("Failed to load project details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    const fetchUsersByRole = async (role) => {
      try {
        const response = await apiClient.get(`/users/role/${role}`);
        return response.data;
      } catch (error) {
        console.error(`Error fetching ${role}s:`, error);
        return [];
      }
    };

    const fetchUsers = async () => {
      const [pms, dirs] = await Promise.all([
        fetchUsersByRole("Project Manager"),
        fetchUsersByRole("Director"),
      ]);
      setProjectManagers(pms);
      setDirectors(dirs);
    };

    fetchProjectDetails();
    fetchUsers();
  }, [id]);

  const calculateDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return 'N/A';
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 ? diffDays : 'Invalid dates';
  };

  // Calculate progress
  let progress = 0;
  if (project && project.tasks && project.tasks.length > 0) {
    const totalTasks = project.tasks.length;
    const completedTasks = project.tasks.filter(
      (task) => task.status && task.status.toLowerCase() === "completed"
    ).length;
    progress = Math.round((completedTasks / totalTasks) * 100);
  }

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading project details...
      </div>
    );
  if (error)
    return <div className="text-red-500 text-center py-4">Error: {error}</div>;
  if (!project)
    return <div className="text-center py-4">No project found.</div>;

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleSave = async () => {
    try {
      const updateData = {
        wbsElement: editedProject.wbsElement,
        name: editedProject.name,
        startDate: editedProject.startDate,
        endDate: editedProject.endDate,
        status: editedProject.status,
        projectManagerId: editedProject.projectManagerId || null,
        directorId: editedProject.directorId || null,
      };

      const response = await apiClient.put(`/projects/${id}`, updateData);
      setProject(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating project:", error);
      // Optionally, display an error message to the user
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back to Projects Link */}
      <Link
        to="/projects"
        className="text-blue-500 hover:underline mb-4 inline-block"
      >
        ← Back to Projects
      </Link>

      {/* Header with Edit button */}
      <div className="flex justify-between items-center mb-6">
        {isEditing ? (
          <Input
            value={editedProject.name}
            onChange={(e) =>
              setEditedProject({ ...editedProject, name: e.target.value })
            }
            className="text-3xl font-bold"
          />
        ) : (
          <h1 className={`text-3xl font-bold ${isDarkMode ? ' text-white' : ' text-black'}`}>{project.name}</h1>
        )}
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)} variant="outline">
            <Edit className="w-4 h-4 mr-2" /> Edit
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Project Overview */}
        <Card>
          <CardHeader>
            <CardTitle className={`text-3xl font-bold mb-6  ${isDarkMode ? ' text-white' : ' text-black'}`}>Project Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p>
                <strong>WBS Element:</strong>{" "}
                {isEditing ? (
                  <Input
                    value={editedProject.wbsElement}
                    onChange={(e) =>
                      setEditedProject({ ...editedProject, wbsElement: e.target.value })
                    }
                  />
                ) : (
                  project.wbsElement
                )}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                {isEditing ? (
                  <select
                    value={editedProject.status}
                    onChange={(e) =>
                      setEditedProject({ ...editedProject, status: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="Not Started">Not Started</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                ) : (
                  <span
                    className={`font-semibold ${
                      project.status.toLowerCase() === "completed"
                        ? "text-green-600"
                        : project.status.toLowerCase() === "in progress"
                        ? "text-blue-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {project.status}
                  </span>
                )}
              </p>
              <p>
                <strong>Progress:</strong> {progress}%
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className={`text-3xl font-bold mb-6  ${isDarkMode ? ' text-white' : ' text-black'}`}>Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center">
                <Calendar className="mr-2" size={20} />
                <p>
                  <strong>Start Date:</strong>{" "}
                  {isEditing ? (
                    <Input
                      type="date"
                      value={
                        editedProject.startDate
                          ? editedProject.startDate.split("T")[0]
                          : ""
                      }
                      onChange={(e) =>
                        setEditedProject({ ...editedProject, startDate: e.target.value })
                      }
                    />
                  ) : (
                    formatDate(project.startDate)
                  )}
                </p>
              </div>
              <div className="flex items-center">
                <Calendar className="mr-2" size={20} />
                <p>
                  <strong>End Date:</strong>{" "}
                  {isEditing ? (
                    <Input
                      type="date"
                      value={
                        editedProject.endDate
                          ? editedProject.endDate.split("T")[0]
                          : ""
                      }
                      onChange={(e) =>
                        setEditedProject({ ...editedProject, endDate: e.target.value })
                      }
                    />
                  ) : (
                    formatDate(project.endDate)
                  )}
                </p>
              </div>
              <div className="flex items-center">
                <Clock className="mr-2" size={20} />
                <p>
                  <strong>Duration:</strong>{" "}
                  {calculateDuration(project.startDate, project.endDate)} days
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Project Team */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className={`text-3xl font-bold mb-6  ${isDarkMode ? ' text-white' : ' text-black'}`}>Project Team</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Project Manager */}
              <div className="flex items-center bg-gray-100 p-3 rounded-lg">
                <User className="mr-3" size={24} />
                <div>
                  <p className={` font-semibold  ${isDarkMode ? ' text-gray-600' : ' text-black'}`}>Project Manager</p>
                  {isEditing ? (
                    <select
                      value={editedProject.projectManagerId || ""}
                      onChange={(e) =>
                        setEditedProject({
                          ...editedProject,
                          projectManagerId: e.target.value,
                        })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="">Not assigned</option>
                      {projectManagers.map((pm) => (
                        <option key={pm.id} value={pm.id}>
                          {pm.username}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p>
                      {project.projectManager
                        ? project.projectManager.username
                        : "Not assigned"}
                    </p>
                  )}
                </div>
              </div>
              {/* Director */}
              <div className="flex items-center bg-gray-100 p-3 rounded-lg">
                <User className="mr-3" size={24} />
                <div>
                  <p className={` font-semibold  ${isDarkMode ? ' text-gray-600' : ' text-black'}`}>Director</p>
                  {isEditing ? (
                    <select
                      value={editedProject.directorId || ""}
                      onChange={(e) =>
                        setEditedProject({
                          ...editedProject,
                          directorId: e.target.value,
                        })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="">Not assigned</option>
                      {directors.map((dir) => (
                        <option key={dir.id} value={dir.id}>
                          {dir.username}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p>
                      {project.projectDirector
                        ? project.projectDirector.username
                        : "Not assigned"}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save and Cancel Buttons */}
        {isEditing && (
          <div className="md:col-span-2 flex justify-end space-x-2">
            <Button
              onClick={() => {
                setIsEditing(false);
                setEditedProject(project); // Reset edits
              }}
              variant="outline"
            >
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-green-500 text-white">
              Save Changes
            </Button>
          </div>
        )}

        {/* Tasks */}
        {project.tasks && project.tasks.length > 0 && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className={`text-3xl font-bold mb-6  ${isDarkMode ? ' text-white' : ' text-black'}`}>Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className= "bg-gray-50">
                    <tr>
                      <th className={` px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider ${isDarkMode ? ' text-gray-800' : ' text-gray-500'}`}>
                        Name
                      </th>
                      <th className= {` px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider ${isDarkMode ? ' text-gray-800' : ' text-gray-500'}`}>
                        Status
                      </th>
                      <th className= {` px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider ${isDarkMode ? ' text-gray-800' : ' text-gray-500'}`}>
                        Assigned To
                      </th>
                      <th className= {` px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider ${isDarkMode ? ' text-gray-800' : ' text-gray-500'}`}>
                        Due Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {project.tasks.map((task) => (
                      <tr key={task.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Link
                            to={`/tasks/${task.id}`}
                            className="text-blue-500 hover:underline"
                          >
                            {task.taskName || task.name}
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              task.status && task.status.toLowerCase() === "completed"
                                ? "bg-green-100 text-green-800"
                                : task.status && task.status.toLowerCase() === "in progress"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {task.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {task.assignedToUser
                            ? task.assignedToUser.username
                            : "Unassigned"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {formatDate(task.due_date)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ProjectDetails;
