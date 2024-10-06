import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import apiClient from "../../utils/apiClient";
import { Calendar, Clock, User } from "lucide-react";
import { Link } from "react-router-dom";

const ProjectDetails = () => {
  const [project, setProject] = useState(null);
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(`/projects/${id}`);
        setProject(response.data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch project details:", err);
        setError("Failed to load project details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
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
      (task) => task.status.toLowerCase() === "completed"
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{project.name}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Project Overview */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Project Overview</h2>
          <div className="space-y-3">
            <p>
              <strong>WBS Element:</strong> {project.wbsElement}
            </p>
            <p>
              <strong>Status:</strong>{" "}
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
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Timeline</h2>
          <div className="space-y-3">
            <div className="flex items-center">
              <Calendar className="mr-2" size={20} />
              <p>
                <strong>Start Date:</strong> {formatDate(project.startDate)}
              </p>
            </div>
            <div className="flex items-center">
              <Calendar className="mr-2" size={20} />
              <p>
                <strong>End Date:</strong> {formatDate(project.endDate)}
              </p>
            </div>
            <div className="flex items-center">
              <Clock className="mr-2" size={20} />
              <p>
                <strong>Duration:</strong> {calculateDuration(project.startDate, project.endDate)} days
              </p>
            </div>
          </div>
        </div>

        {/* Project Team */}
        <div className="bg-white rounded-lg shadow-md p-6 md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Project Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center bg-gray-100 p-3 rounded-lg">
              <User className="mr-3" size={24} />
              <div>
                <p className="font-semibold">Project Manager</p>
                <p>
                  {project.projectManager
                    ? project.projectManager.username
                    : "Not assigned"}
                </p>
              </div>
            </div>
            <div className="flex items-center bg-gray-100 p-3 rounded-lg">
              <User className="mr-3" size={24} />
              <div>
                <p className="font-semibold">Director</p>
                <p>
                  {project.projectDirector
                    ? project.projectDirector.username
                    : "Not assigned"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tasks */}
        {project.tasks && project.tasks.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Tasks</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assigned To
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                            task.status.toLowerCase() === "completed"
                              ? "bg-green-100 text-green-800"
                              : task.status.toLowerCase() === "in progress"
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
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetails;
