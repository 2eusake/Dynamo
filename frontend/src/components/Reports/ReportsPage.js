import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ReportsPage = () => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [notification, setNotification] = useState('');
  const [progressData, setProgressData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectsResponse = await axios.get('http://localhost:5000/api/projects', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const fetchedProjects = projectsResponse.data.projects;
        const fetchedTasks = projectsResponse.data.tasks;
        setProjects(fetchedProjects);
        setTasks(fetchedTasks);

        // Generate mock progress data for the graph
        const mockProgressData = generateMockProgressData(fetchedProjects);
        setProgressData(mockProgressData);
      } catch (error) {
        console.error('Error fetching reports data:', error);
        setNotification('Failed to fetch reports data.');
      }
    };

    fetchData();
  }, []);

  // Generates mock progress data for the past 7 days for each project
  const generateMockProgressData = (projects) => {
    const data = [];
    const today = new Date();

    // Generate data for each day in the past week
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateString = date.toISOString().split('T')[0];

      // Calculate average progress across all projects for the given day
      const totalProgress = projects.reduce((sum, project) => sum + (project.progress || 0), 0);
      const averageProgress = projects.length > 0 ? totalProgress / projects.length : 0;

      data.push({
        date: dateString,
        progress: averageProgress.toFixed(2), // Average progress
      });
    }

    return data;
  };

  const getTotalProjects = () => projects.length;
  const getActiveProjects = () => projects.filter(project => project.status === 'Active').length;
  const getCompletedTasks = () => tasks.filter(task => task.status === 'Completed').length;
  const getOverdueTasks = () => tasks.filter(task => new Date(task.endDate) < new Date()).length;

  return (
    <div className="reports-page p-6 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Reports Dashboard</h1>
      {notification && (
        <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{notification}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="text-lg font-bold">Total Projects</h3>
          <p className="text-4xl font-bold text-blue-600">{getTotalProjects()}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="text-lg font-bold">Active Projects</h3>
          <p className="text-4xl font-bold text-green-600">{getActiveProjects()}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="text-lg font-bold">Completed Tasks</h3>
          <p className="text-4xl font-bold text-purple-600">{getCompletedTasks()}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="text-lg font-bold">Overdue Tasks</h3>
          <p className="text-4xl font-bold text-red-600">{getOverdueTasks()}</p>
        </div>
      </div>

      {/* Line Chart for Project Progress */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Project Progress Over Time</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={progressData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="progress" stroke="#8884d8" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <h2 className="text-3xl font-bold mb-6 text-gray-800">Project Reports</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {projects.length > 0 ? (
          projects.map(project => (
            <div key={project.id} className="bg-white shadow rounded-lg p-4">
              <Link to={`/projects/${project.id}`} className="block">
                <h3 className="text-xl font-semibold">{project.name}</h3>
                <p className="text-gray-600 mb-3">{project.description || 'No description available'}</p>
                <div className="bg-gray-200 rounded-full h-2.5 mb-3">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${project.progress || 0}%` }}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500">Progress: {project.progress || 0}%</p>
                  <p className="text-sm text-gray-500">Status: {project.status}</p>
                </div>
              </Link>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">No projects available.</p>
        )}
      </div>

      <h2 className="text-3xl font-bold mb-6 text-gray-800">Task Reports</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.length > 0 ? (
          tasks.map(task => (
            <div key={task.id} className="bg-white shadow rounded-lg p-4">
              <Link to={`/tasks/${task.id}`} className="block">
                <h3 className="text-xl font-semibold">{task.name}</h3>
                <p className="text-gray-600 mb-1">Assigned To: {task.assignedToUser?.username || 'Unassigned'}</p>
                <p className="text-gray-600 mb-1">Status: {task.status}</p>
                <p className="text-gray-600">End Date: {new Date(task.endDate).toLocaleDateString()}</p>
              </Link>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">No tasks available.</p>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;

