import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { refreshToken } from '../utils/auth';
import * as tf from '@tensorflow/tfjs';

export const ProjectContext = createContext();

const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [consultants, setConsultants] = useState([]);
  const [model, setModel] = useState(null);
  const [latestProject, setLatestProject] = useState(null);

  const fetchProjects = async () => {
    try {
      await refreshToken(); // Refresh the token if needed
      const token = localStorage.getItem('token');
      const [projectsResponse, usersResponse] = await Promise.all([
        axios.get('http://localhost:5000/api/projects', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get('http://localhost:5000/api/users', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const projectsData = projectsResponse.data;
      setProjects(projectsData);
      setConsultants(usersResponse.data.filter(user => user.role === 'consultant'));

      if (projectsData.length > 0) {
        const latest = projectsData.reduce((prev, curr) => (new Date(prev.createdAt) > new Date(curr.createdAt) ? prev : curr));
        setLatestProject(latest);
      }
    } catch (error) {
      console.error('Error fetching projects or users:', error);
    }
  };

  const fetchUserProjects = async () => {
    try {
      await refreshToken(); // Refresh the token if needed
      const token = localStorage.getItem('token');
      console.log('Fetching user projects with token:', token);
      const response = await axios.get('http://localhost:5000/api/projects/user', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching user projects:', error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const predictProjectCompletion = (project) => {
    if (!model) return null;
    const inputTensor = tf.tensor2d([project.features]);
    const prediction = model.predict(inputTensor);
    return prediction.dataSync();
  };

  const addProject = async (project) => {
    try {
      await refreshToken(); // Refresh the token if needed
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/projects', project, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects([...projects, response.data]);
      if (projects.length === 0 || new Date(response.data.createdAt) > new Date(latestProject.createdAt)) {
        setLatestProject(response.data);
      }
    } catch (error) {
      console.error('Error adding project:', error);
    }
  };

  const updateProject = async (id, updatedProject) => {
    try {
      await refreshToken(); // Refresh the token if needed
      const token = localStorage.getItem('token');
      const response = await axios.put(`http://localhost:5000/api/projects/${id}`, updatedProject, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(projects.map(project => project.id === id ? response.data : project));
      if (new Date(response.data.createdAt) > new Date(latestProject.createdAt)) {
        setLatestProject(response.data);
      }
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  const deleteProject = async (id) => {
    try {
      await refreshToken(); // Refresh the token if needed
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(projects.filter(project => project.id !== id));
      if (latestProject.id === id && projects.length > 0) {
        const newLatest = projects.reduce((prev, curr) => (new Date(prev.createdAt) > new Date(curr.createdAt) ? prev : curr));
        setLatestProject(newLatest);
      }
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  return (
    <ProjectContext.Provider value={{ 
      projects, 
      consultants, 
      latestProject,
      fetchProjects,
      fetchUserProjects, 
      addProject, 
      updateProject, 
      deleteProject, 
      predictProjectCompletion 
    }}>
      {children}
    </ProjectContext.Provider>
  );
};

export default ProjectProvider;
