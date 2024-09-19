import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');

        const [projectsResponse, tasksResponse, userResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/projects', {
            headers: { 'Authorization': `Bearer ${token}` },
          }),
          axios.get('http://localhost:5000/api/tasks', {
            headers: { 'Authorization': `Bearer ${token}` },
          }),
          axios.get('http://localhost:5000/api/users/profile', {
            headers: { 'Authorization': `Bearer ${token}` },
          })
        ]);

        setProjects(projectsResponse.data);
        setTasks(tasksResponse.data);
        setUser(userResponse.data);
      } catch (err) {
        setError('Failed to fetch data. Please try again later.');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const currentProjects = projects.filter(project => project.progress < 100);
  const completedProjects = projects.filter(project => project.progress === 100);

  const calendarEvents = projects.map(project => ({
    title: project.name,
    start: new Date(project.startDate),
    end: new Date(project.endDate),
  }));

  const projectStatus = [
    { name: 'On Track', value: currentProjects.filter(p => new Date(p.endDate) >= new Date()).length },
    { name: 'At Risk', value: currentProjects.filter(p => new Date(p.endDate) < new Date()).length },
    { name: 'Completed', value: completedProjects.length },
  ];

  const handleProjectClick = (project) => {
    setSelectedProject(project);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 p-4 overflow-auto">
        <h2 className="text-2xl font-bold text-deloitte-dark-green">
          Welcome back, {user?.username}!
        </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Current Projects */}
        <div className="col-span-2 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Current Projects
          </h3>
          <div className="space-y-4">
            {currentProjects.map(project => (
              <div
                key={project.id}
                className="border border-gray-200 p-4 rounded-md shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleProjectClick(project)}
              >
                <h4 className="text-lg font-semibold text-gray-800 mb-2">
                  {project.name}
                </h4>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Progress: {project.progress}%</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    project.progress < 50 ? "bg-red-200 text-red-800" :
                    project.progress < 80 ? "bg-yellow-200 text-yellow-800" :
                    "bg-green-200 text-green-800"
                  }`}>
                    {project.progress < 50 ? "At Risk" : project.progress < 80 ? "In Progress" : "Near Completion"}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Project Overview */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Project Overview
          </h3>
          <div className="space-y-2">
            {projectStatus.map((status, index) => (
              <div key={status.name} className="flex items-center justify-between">
                <span>{status.name}</span>
                <span className="font-semibold">{status.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Calendar Section */}
        <div className="col-span-2 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Project Timeline
          </h3>
          <Calendar
            localizer={localizer}
            events={calendarEvents}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 400 }}
          />
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Recent Activities
          </h3>
          <ul className="space-y-2">
            {tasks.slice(0, 5).map(task => (
              <li key={task.id} className="text-gray-700 flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                <span>{task.name} - {task.status}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Notification Bar */}
      <div className="mt-6 bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Notifications
        </h3>
        <ul className="space-y-2">
          <li className="flex items-center text-yellow-700">
            <span className="mr-2">⚠️</span>
            <span>Project XYZ is 2 days overdue.</span>
          </li>
          <li className="flex items-center text-green-700">
            <span className="mr-2">✅</span>
            <span>Task "Update documentation" has been completed.</span>
          </li>
          <li className="flex items-center text-blue-700">
            <span className="mr-2">🔔</span>
            <span>New task assigned: "Review Q3 reports"</span>
          </li>
        </ul>
      </div>

      {/* Project Details Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white w-2/3 max-h-[80vh] overflow-y-auto rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">{selectedProject.name}</h3>
            <p>Progress: {selectedProject.progress}%</p>
            <p>Start Date: {new Date(selectedProject.startDate).toLocaleDateString()}</p>
            <p>End Date: {new Date(selectedProject.endDate).toLocaleDateString()}</p>
            {/* Add more project details here */}
            <button
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md"
              onClick={() => setSelectedProject(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;