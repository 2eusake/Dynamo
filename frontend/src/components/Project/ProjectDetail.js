import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ProjectContext } from '../../contexts/ProjectContext';

const ProjectDetail = () => {
  const { id } = useParams();
  const { projects, predictProjectCompletion } = useContext(ProjectContext) || {}; 
  const [project, setProject] = useState(null);
  const [prediction, setPrediction] = useState(null);

  useEffect(() => {
    if (!projects || !predictProjectCompletion) return; 

    const projectId = parseInt(id, 10);
    const selectedProject = projects.find(p => p.id === projectId);
    setProject(selectedProject);

    if (selectedProject) {
      const pred = predictProjectCompletion(selectedProject);
      setPrediction(pred);
    } else {
      setPrediction(null); 
    }
  }, [id, projects, predictProjectCompletion]);

  return (
    <div>
      {project ? (
        <>
          <h2>Project Detail - {project.name}</h2>
          <p>Description: {project.description || 'No description available'}</p>
          <p>Progress: {project.progress || 0}%</p>
          {prediction !== null ? (
            <p>Predicted Completion Time: {prediction[0].toFixed(1)} days</p>
          ) : (
            <p>No prediction available</p>
          )}
        </>
      ) : (
        <p>Loading project details...</p>
      )}
    </div>
  );
};

export default ProjectDetail;
