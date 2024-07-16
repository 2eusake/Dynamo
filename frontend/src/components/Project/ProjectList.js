import React from 'react';
import { Link } from 'react-router-dom';

const ProjectList = () => {
  // Dummy data for projects
  const projects = [
    { id: 1, name: 'Project 1' },
    { id: 2, name: 'Project 2' },
  ];

  return (
    <div>
      <h3>Projects</h3>
      <ul>
        {projects.map((project) => (
          <li key={project.id}>
            <Link to={`/project/${project.id}`}>{project.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectList;
