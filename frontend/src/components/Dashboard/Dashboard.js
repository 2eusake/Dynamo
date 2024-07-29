import React, { useContext } from 'react';
import ProjectCompletionChart from '../Project/ProjectCompletionChart';
import { Link } from 'react-router-dom';
import { ProjectContext } from '../../contexts/ProjectContext';

const Dashboard = () => {
  const { projects } = useContext(ProjectContext);

  return (
    <div className="dashboard">
      <nav>
        <h1>Dashboard</h1>
        <Link to="/create-project">Create Project</Link>
      </nav>
      <div className="content">
        <div className="project-list">
          <h2>Projects</h2>
          <ul>
            {projects.map(project => (
              <li key={project.id}>
                <span>{project.name}</span>
                <span>{project.progress}%</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="chart-container">
          <ProjectCompletionChart />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
