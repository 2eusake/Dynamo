import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ProjectContext } from '../../contexts/ProjectContext';

const ProjectList = () => {
  const { projects, deleteProject } = useContext(ProjectContext);

  return (
    <div>
      <h3>Projects</h3>
      <ul>
        {projects.length > 0 ? (
          projects.map((project) => (
            <li key={project.id}>
              <Link to={`/projects/${project.id}`}>{project.name}</Link>
              <button onClick={() => deleteProject(project.id)}>Delete</button>
            </li>
          ))
        ) : (
          <li>No projects available</li>
        )}
      </ul>
    </div>
  );
};

export default ProjectList;
