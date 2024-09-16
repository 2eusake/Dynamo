import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { refreshToken } from '../utils/auth';
import * as tf from '@tensorflow/tfjs';

export const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [consultants, setConsultants] = useState([]);
  const [latestProject, setLatestProject] = useState(null);
  const [model, setModel] = useState(null);

  const fetchProjects = async () => {
    try {
      await refreshToken();
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');

      let projectsUrl = 'http://localhost:5000/api/projects';
      if (role === 'consultant') {
        projectsUrl = 'http://localhost:5000/api/projects/user';
      }

      const [projectsResponse, usersResponse] = await Promise.all([
        axios.get(projectsUrl, {
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
        const latest = projectsData.reduce((prev, curr) => new Date(prev.createdAt) > new Date(curr.createdAt) ? prev : curr);
        setLatestProject(latest);
      }
    } catch (error) {
      console.error('Error fetching projects or users:', error);
    }
  };

  const fetchUserProjects = async () => {
    try {
      await refreshToken();
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

  const predictProjectCompletion = (project) => {
    if (!model) return null;
    const inputTensor = tf.tensor2d([project.features]);
    const prediction = model.predict(inputTensor);
    return prediction.dataSync();
  };

  const addProject = async (project) => {
    try {
      await refreshToken();
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/projects', project, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(prevProjects => [...prevProjects, response.data]);
      if (projects.length === 0 || new Date(response.data.createdAt) > new Date(latestProject.createdAt)) {
        setLatestProject(response.data);
      }
    } catch (error) {
      console.error('Error adding project:', error);
    }
  };

  const updateProject = async (id, updatedProject) => {
    try {
      await refreshToken();
      const token = localStorage.getItem('token');
      const response = await axios.put(`http://localhost:5000/api/projects/${id}`, updatedProject, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(prevProjects => prevProjects.map(project => project.id === id ? response.data : project));
      if (latestProject && new Date(response.data.createdAt) > new Date(latestProject.createdAt)) {
        setLatestProject(response.data);
      }
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  const deleteProject = async (id) => {
    try {
      await refreshToken();
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(prevProjects => prevProjects.filter(project => project.id !== id));
      if (latestProject && latestProject.id === id && projects.length > 0) {
        const newLatest = projects.reduce((prev, curr) => (new Date(prev.createdAt) > new Date(curr.createdAt) ? prev : curr));
        setLatestProject(newLatest);
      }
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  useEffect(() => {
    fetchProjects();

    const loadModel = async () => {
      try {
        const loadedModel = await tf.loadLayersModel('/path/to/model.json');
        setModel(loadedModel);
      } catch (error) {
        console.error('Error loading model:', error);
      }
    };
    loadModel();
  }, []);

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