import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ProjectContext } from '../../contexts/ProjectContext';

const ProjectList = ({handleGridItemClick}) => {
  const { projects } = useContext(ProjectContext);
  
  return (
    <div className="project-grid">
    <div className="grid-container">
      {projects.map((project) => (
        <div key={project.id} className="grid-item">
          <Link to={`/project/${project.id}`} onClick={props.handleGridItemClick}>{project.name}</Link>
        </div>
      ))}
    </div>
  </div>
  );
};
export default ProjectList;