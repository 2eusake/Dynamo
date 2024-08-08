import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ProjectContext } from '../../contexts/ProjectContext';
import './ProjectsList.css';

const ProjectsPage = () => {
  const { projects, fetchProjects } = useContext(ProjectContext);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return (
    <div className="projects-page">
      <h1>Projects and Tasks</h1>
      <div className="tiles-container">
        {projects.length > 0 ? (
          projects.map(project => (
            <div key={project.id} className="tile">
              <Link to={`/projects/${project.id}`}>
                <h2>{project.name}</h2>
                <p>{project.description || 'No description available'}</p>
                <p>Progress: {project.progress || 0}%</p>
              </Link>
              <div className="tasks-container">
                {project.tasks.map(task => (
                  <div key={task.id} className="task-tile">
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
