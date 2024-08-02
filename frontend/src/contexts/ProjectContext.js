import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import * as tf from '@tensorflow/tfjs';

export const ProjectContext = createContext();

const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [consultants, setConsultants] = useState([]);
  const [model, setModel] = useState(null);

  useEffect(() => {
    const fetchProjectsAndUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const [projectsResponse, usersResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/projects', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://localhost:5000/api/users', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setProjects(projectsResponse.data);
        setConsultants(usersResponse.data.filter(user => user.role === 'consultant'));
      } catch (error) {
        console.error('Error fetching projects or users:', error);
      }
    };

    fetchProjectsAndUsers();
  }, []);

  const predictProjectCompletion = (project) => {
    if (!model) return null;

    const inputTensor = tf.tensor2d([project.features]);
    const prediction = model.predict(inputTensor);
    return prediction.dataSync();
  };

  const addProject = async (project) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/projects', project, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects([...projects, response.data]);
    } catch (error) {
      console.error('Error adding project:', error);
    }
  };

  const updateProject = async (id, updatedProject) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`http://localhost:5000/api/projects/${id}`, updatedProject, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(projects.map(project => project.id === id ? response.data : project));
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  const deleteProject = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(projects.filter(project => project.id !== id));
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  return (
    <ProjectContext.Provider value={{ projects, consultants, addProject, updateProject, deleteProject, predictProjectCompletion }}>
      {children}
    </ProjectContext.Provider>
  );
};

export default ProjectProvider;
