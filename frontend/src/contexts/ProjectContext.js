import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const ProjectContext = createContext();

const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [model, setModel] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/projects', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProjects(response.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, []);

  const predictProjectCompletion = (project) => {
    if (!model) return null;

    const inputTensor = tf.tensor2d([project.features]);
    const prediction = model.predict(inputTensor);
    return prediction.dataSync();
  };

  return (
    <ProjectContext.Provider value={{ projects, predictProjectCompletion }}>
      {children}
    </ProjectContext.Provider>
  );
};

export default ProjectProvider;
