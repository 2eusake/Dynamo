// src/components/ProjectsPage/ProjectsPage.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../Project/ProjectsList.css'; // Assuming you have a CSS file for styling

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [notification, setNotification] = useState('');

  useEffect(() => {
    // Fetch projects from the backend
    const fetchProjects = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/projects', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setProjects(response.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setNotification('Failed to fetch projects.');
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="projects-page-container">
      <h1>Projects and Tasks</h1>
      {notification && <div className="notification">{notification}</div>}
      <div className="projects-grid">
        {projects.length > 0 ? (
          projects.map(project => (
            <div key={project.id} className="project-card">
              <h2>{project.name}</h2>
              <p>{project.description || 'No description available'}</p>
              <p>Progress: {project.progress || 0}%</p>
              <p>Status: {project.status}</p>
              <Link to={`/projects/${project.id}`} className="view-details-link">
                View Details
              </Link>
              {project.tasks && project.tasks.length > 0 && (
                <div className="tasks-section">
                  <h3>Tasks:</h3>
                  {project.tasks.map(task => (
                    <div key={task.id} className="task-card">
                      <p>Task Name: {task.name}</p>
                      <p>Assigned To: {task.assignedToUserId}</p>
                      <p>Status: {task.status}</p>
                      <Link to={`/tasks/${task.id}`} className="view-task-link">
                        View Task
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No projects available.</p>
        )}
      </div>
    </div>
  );
};

export default ProjectsPage;
