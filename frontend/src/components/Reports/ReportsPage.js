import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import Alert from '../../components/Reports/Alert';
import AlertDescription from '../../components/Reports/AlertDescription';
import apiClient from '../../utils/apiClient'; // Use apiClient here
import './ReportsPage.css';

const ReportsPage = () => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [notification, setNotification] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: projectsData } = await apiClient.get('/projects');
        setProjects(projectsData);

        const { data: tasksData } = await apiClient.get('/tasks');
        setTasks(tasksData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setNotification('Failed to fetch reports data.');
      }
    };

    fetchData();
  }, []);

  const getTotalProjects = () => projects.length;
  const getActiveProjects = () => projects.filter(project => project.status === 'Active').length;
  const getCompletedTasks = () => tasks.filter(task => task.status === 'Completed').length;
  const getOverdueTasks = () => tasks.filter(task => new Date(task.endDate) < new Date()).length;

  const isOverdue = (project) => {
    return project.status === 'Active' && new Date(project.endDate) < new Date();
  };

  return (
    <div className="reports-page p-6">
      <h1 className="text-3xl font-bold mb-6">Reports</h1>
      {notification && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{notification}</div>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2">Total Projects</h2>
          <p className="text-3xl font-bold">{getTotalProjects()}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2">Active Projects</h2>
          <p className="text-3xl font-bold">{getActiveProjects()}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2">Completed Tasks</h2>
          <p className="text-3xl font-bold">{getCompletedTasks()}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2">Overdue Tasks</h2>
          <p className="text-3xl font-bold">{getOverdueTasks()}</p>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4">Project Reports</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {projects.length > 0 ? (
          projects.map(project => (
            <div key={project.id} className="bg-white shadow-md rounded-lg overflow-hidden">
              <Link to={`/projects/${project.id}`} className="block p-4">
                <h3 className="text-lg font-semibold mb-2">{project.name}</h3>
                <p className="text-gray-600 mb-3">{project.description || 'No description available'}</p>
                <div className="bg-gray-200 rounded-full h-2.5 mb-3">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${project.progress || 0}%` }}
                  ></div>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500">Progress: {project.progress || 0}%</p>
                  <p className="text-sm text-gray-500">Status: {project.status}</p>
                </div>
                {isOverdue(project) && (
                  <Alert variant="destructive" className="mt-3">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>This project is overdue!</AlertDescription>
                  </Alert>
                )}
              </Link>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">No projects available.</p>
        )}
      </div>

      <h2 className="text-2xl font-bold mb-4">Task Reports</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.length > 0 ? (
          tasks.map(task => (
            <div key={task.id} className="bg-white shadow-md rounded-lg overflow-hidden">
              <Link to={`/tasks/${task.id}`} className="block p-4">
                <h3 className="text-lg font-semibold mb-2">{task.name}</h3>
                <p className="text-gray-600 mb-1">Assigned To: {task.assignedToUser?.username || 'Unassigned'}</p>
                <p className="text-gray-600 mb-1">Status: {task.status}</p>
                <p className="text-gray-600">End Date: {new Date(task.endDate).toLocaleDateString()}</p>
                {new Date(task.endDate) < new Date() && task.status !== 'Completed' && (
                  <Alert variant="destructive" className="mt-3">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>This task is overdue!</AlertDescription>
                  </Alert>
                )}
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
