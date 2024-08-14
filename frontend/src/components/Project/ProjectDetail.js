import React, { useContext, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ProjectContext } from '../../contexts/ProjectContext';

const ProjectDetail = () => {
  const { id } = useParams();
  const { projects, predictProjectCompletion } = useContext(ProjectContext);
  const [project, setProject] = useState(null);
  const [prediction, setPrediction] = useState(null);

  useEffect(() => {
    if (!projects) return;

    const projectId = parseInt(id, 10);
    const selectedProject = projects.find(p => p.id === projectId);
    setProject(selectedProject);

    if (selectedProject && predictProjectCompletion) {
      const pred = predictProjectCompletion(selectedProject);
      setPrediction(pred);
    } else {
      setPrediction(null);
    }
  }, [id, projects, predictProjectCompletion]);

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-md">
      {project ? (
        <>
          <h2 className="text-4xl font-bold mb-4 text-deloitte-blue">Project: {project.name}</h2>
          <div className="flex justify-between items-center mb-6">
            <p className="text-xl text-deloitte-black">
              {project.description || 'No description available'}
            </p>
            {prediction !== null ? (
              <p className="text-lg text-deloitte-green bg-deloitte-blue p-2 rounded-lg shadow">
                Predicted Completion: {prediction[0].toFixed(1)} days
              </p>
            ) : (
              <p className="text-lg text-deloitte-cyan">No prediction available</p>
            )}
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xl font-semibold text-deloitte-black">Progress</span>
              <span className="text-xl font-semibold text-deloitte-black">{project.progress || 0}%</span>
            </div>
            <div className="w-full bg-gray-300 rounded-full h-4">
              <div
                className="bg-deloitte-green h-4 rounded-full"
                style={{ width: `${project.progress || 0}%` }}
              ></div>
            </div>
          </div>

          <h3 className="text-3xl font-bold mb-4 text-deloitte-blue">Tasks</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {project.tasks && project.tasks.map(task => (
              <div key={task.id} className="bg-deloitte-blue p-4 rounded-lg shadow-md">
                <Link to={`/tasks/${task.id}`} className="block text-deloitte-white text-xl font-semibold mb-2">
                  {task.name}
                </Link>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-deloitte-white">{task.progress}% Complete</span>
                </div>
                <div className="w-full bg-gray-400 rounded-full h-2">
                  <div
                    className="bg-deloitte-cyan h-2 rounded-full"
                    style={{ width: `${task.progress || 0}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p className="text-deloitte-black">Loading project details...</p>
      )}
    </div>
  );
};

export default ProjectDetail;
