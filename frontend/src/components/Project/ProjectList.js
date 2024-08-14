import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './ProjectsList.css';

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
    <div className="projects-page">
      <h1>Projects and Tasks</h1>
      {notification && <div className="notification">{notification}</div>}
      <div className="tiles-container">
        {projects.length > 0 ? (
          projects.map(project => (
            <div key={project.id} className="tile">
              <Link to={`/projects/${project.id}`}>
                <h2>{project.name}</h2>
                <p>{project.description || 'No description available'}</p>
                
                <div className="progress-bar">
                  <div className="progress" style={{ width: `${project.progress || 0}%` }}>
                    <span>{project.progress || 0}%</span>
                  </div>
                </div>
                
                <p>Status: {project.status}</p>
              </Link>
              {project.tasks && project.tasks.length > 0 && (
                <div className="tasks-container">
                  {project.tasks.map(task => (
                    <div key={task.id} className="task-tile">
                      <Link to={`/tasks/${task.id}`}>
                        <h3>{task.name}</h3>
                        <p>Assigned To: {task.assignedToUser?.username || 'Unassigned'}</p>
                        <p>Status: {task.status}</p>
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
