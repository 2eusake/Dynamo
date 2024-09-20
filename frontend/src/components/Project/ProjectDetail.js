import React, { useContext, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ProjectContext } from '../../contexts/ProjectContext';
import apiClient from '../../utils/apiClient';

const ProjectDetail = () => {
  const { id } = useParams();
  const { projects, predictProjectCompletion } = useContext(ProjectContext);
  const [project, setProject] = useState(null);
  const [prediction, setPrediction] = useState(null);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const response = await apiClient.get(`/projects/${id}`);
        setProject(response.data);

        if (predictProjectCompletion) {
          const pred = predictProjectCompletion(response.data);
          setPrediction(pred);
        } else {
          setPrediction(null);
        }
      } catch (error) {
        console.error('Error fetching project details:', error);
      }
    };

    fetchProjectDetails();
  }, [id, predictProjectCompletion]);

  if (!project) {
    return <p className="text-deloitte-black">Loading project details...</p>;
  }

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-deloitte-blue">{project.name}</h1>
      <p className="mb-2"><strong>Description:</strong> {project.description || 'No description available'}</p>
      <p className="mb-2"><strong>WBS Element:</strong> {project.wbsElement || 'N/A'}</p>
      <p className="mb-2"><strong>Start Date:</strong> {project.startDate ? new Date(project.startDate).toLocaleDateString() : 'N/A'}</p>
      <p className="mb-2"><strong>End Date:</strong> {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'N/A'}</p>
      <p className="mb-2"><strong>Status:</strong> {project.status}</p>
      <p className="mb-2"><strong>Project Manager ID:</strong> {project.projectManagerId || 'N/A'}</p>
      <p className="mb-2"><strong>Director ID:</strong> {project.directorId || 'N/A'}</p>

      {prediction && (
        <div className="mb-4 p-4 bg-yellow-100 border border-yellow-200 rounded-lg">
          <strong>Predicted Completion:</strong> {prediction}
        </div>
      )}

      <Link to="/projects" className="text-blue-500 hover:underline">Back to Projects</Link>
    </div>
  );
};

export default ProjectDetail;
