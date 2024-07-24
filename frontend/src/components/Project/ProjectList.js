import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ProjectContext } from '../../contexts/ProjectContext'; // Adjust the path as necessary

const ProjectList = () => {
  const { projects } = useContext(ProjectContext) || { projects: [] }; // Access projects from context

  return (
    <div>
      <h3>Projects</h3>
      <ul>
        {projects.length > 0 ? (
          projects.map((project) => (
            <li key={project.id}>
              <Link to={`/project/${project.id}`}>{project.name}</Link>
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
