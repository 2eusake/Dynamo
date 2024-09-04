<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import axios from 'axios';
=======
import React from 'react';
>>>>>>> 6ff4711fd14c1449a2ad5b76ecb523b6786a0b62
import { Link } from 'react-router-dom';
import './ProjectsList.css';

const ProjectsPage = () => {
<<<<<<< HEAD
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
=======
  const projects = [
    {
      id: 26,
      name: 'Project Alpha',
      description: 'Description for Project Alpha',
      progress: 30,
      tasks: [
        { id: 3, name: 'Task 1 for Alpha', progress: 20 },
        { id: 4, name: 'Task 2 for Alpha', progress: 50 },
      ],
    },
    {
      id: 27,
      name: 'Project Beta',
      description: 'Description for Project Beta',
      progress: 50,
      tasks: [
        { id: 5, name: 'Task 1 for Beta', progress: 60 },
        { id: 6, name: 'Task 2 for Beta', progress: 80 },
      ],
    },
    {
      id: 28,
      name: 'Project Gamma',
      description: 'Description for Project Gamma',
      progress: 75,
      tasks: [],
    },
    {
      id: 29,
      name: 'Project Delta',
      description: 'Description for Project Delta',
      progress: 40,
      tasks: [],
    },
  ];
>>>>>>> 6ff4711fd14c1449a2ad5b76ecb523b6786a0b62

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
