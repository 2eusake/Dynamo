
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './ReportsPage.css'; // You'll need to create this CSS file

const ReportsPage = () => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [notification, setNotification] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectsResponse = await axios.get('http://localhost:5000/api/projects', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setProjects(projectsResponse.data);

        const tasksResponse = await axios.get('http://localhost:5000/api/tasks', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setTasks(tasksResponse.data);
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
  const getOverdueTasks = () => tasks.filter(task => new Date(task.dueDate) < new Date()).length;

  return (
    <div className="reports-page">
      <h1 className="reports-h1"> Reports</h1>
      {notification && <div className="notification">{notification}</div>}
      <div className="summary-tiles">
        <div className="summary-tile">
          <h2>Total Projects</h2>
          <p>{getTotalProjects()}</p>
        </div>
        <div className="summary-tile">
          <h2> Active Projects</h2>
          <p>{getActiveProjects()}</p>
        </div>
        <div className="summary-tile">
          <h2> Completed Tasks</h2>
          <p>{getCompletedTasks()}</p>
        </div>
        <div className="summary-tile">
          <h2>Overdue Tasks</h2>
          <p>{getOverdueTasks()}</p>
        </div>
      </div>
      <h2 className="reports-h2">Project Reports</h2>
      <div className="tiles-container">
        {projects.length > 0 ? (
          projects.map(project => (
            <div key={project.id} className="tile">
              <Link to={`/projects/${project.id}`}>
                <h3>{project.name}</h3>
                <p>{project.description || 'No description available'}</p>
                <div className="progress-bar">
                  <div className="progress" style={{ width: `${project.progress || 0}%` }}>
                    <span>{project.progress || 0}%</span>
                  </div>
                </div>
                <p>Status: {project.status}</p>
              </Link>
            </div>
          ))
        ) : (
          <p>No projects available.</p>
        )}
      </div>

      <h2 className="reports-h2">Task Reports</h2>
      <div className="tiles-container">
        {tasks.length > 0 ? (
          tasks.map(task => (
            <div key={task.id} className="tile task-tile">
              <Link to={`/tasks/${task.id}`}>
                <h3>{task.name}</h3>
                <p>Assigned To: {task.assignedToUser?.username || 'Unassigned'}</p>
                <p>Status: {task.status}</p>
                <p>Due Date: {new Date(task.dueDate).toLocaleDateString()}</p>
              </Link>
            </div>
          ))
        ) : (
          <p>No tasks available.</p>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;

