import React from 'react';
import { Link } from 'react-router-dom';
import './ProjectsList.css';

const ProjectsPage = () => {
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

  return (
    <div className="projects-page">
      <h1 className="text-deloitte-blue">Projects and Tasks</h1>
      <div className="tiles-container">
        {projects.length > 0 ? (
          projects.map(project => (
            <div key={project.id} className="tile bg-deloitte-cyan text-deloitte-black">
              <Link to={`/projects/${project.id}`}>
                <h2>{project.name}</h2>
                <p>{project.description || 'No description available'}</p>
                <p>Progress: {project.progress || 0}%</p>
              </Link>
              <div className="tasks-container">
                {project.tasks.map(task => (
                  <div key={task.id} className="task-tile bg-deloitte-white">
                    <Link to={`/tasks/${task.id}`}>
                      <h3>{task.name}</h3>
                      <p>Progress: {task.progress || 0}%</p>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p>No projects available</p>
        )}
      </div>
    </div>
  );
};

export default ProjectsPage;
