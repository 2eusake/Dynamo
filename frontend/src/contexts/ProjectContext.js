import React, { createContext, useState, useEffect } from "react";
import apiClient from "../utils/apiClient"; // Import the centralized API client
import * as tf from "@tensorflow/tfjs";

export const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [consultants, setConsultants] = useState([]);
  const [latestProject, setLatestProject] = useState(null);
  const [model, setModel] = useState(null);

  const fetchProjects = async () => {
    try {
      const role = localStorage.getItem("role");
      let projectsUrl = "/projects";

      if (role === "Consultant") {
        projectsUrl = "/projects/user";
      }
      if (role === "Director") {
        projectsUrl = "/projects";
      }

      const [projectsResponse, usersResponse] = await Promise.all([
        apiClient.get(projectsUrl),
        apiClient.get("/users"),
      ]);

      const projectsData = projectsResponse.data;
      setProjects(projectsData);
      setConsultants(
        usersResponse.data.filter((user) => user.role === "Consultant")
      );

      if (projectsData.length > 0) {
        const latest = projectsData.reduce((prev, curr) =>
          new Date(prev.createdAt) > new Date(curr.createdAt) ? prev : curr
        );
        setLatestProject(latest);
      }
    } catch (error) {
      console.error("Error fetching projects or users:", error);
    }
  };

  const fetchUserProjects = async () => {
    try {
      const response = await apiClient.get("/projects/user");
      setProjects(response.data);
    } catch (error) {
      console.error("Error fetching user projects:", error);
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
      const response = await apiClient.post("/projects", project);
      setProjects((prevProjects) => [...prevProjects, response.data]);
      if (
        projects.length === 0 ||
        new Date(response.data.createdAt) > new Date(latestProject.createdAt)
      ) {
        setLatestProject(response.data);
      }
    } catch (error) {
      console.error("Error adding project:", error);
    }
  };

  const updateProject = async (id, updatedProject) => {
    try {
      const response = await apiClient.put(`/projects/${id}`, updatedProject);
      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project.id === id ? response.data : project
        )
      );
      if (
        latestProject &&
        new Date(response.data.createdAt) > new Date(latestProject.createdAt)
      ) {
        setLatestProject(response.data);
      }
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  const deleteProject = async (id) => {
    try {
      await apiClient.delete(`/projects/${id}`);
      setProjects((prevProjects) =>
        prevProjects.filter((project) => project.id !== id)
      );
      if (latestProject && latestProject.id === id && projects.length > 0) {
        const newLatest = projects.reduce((prev, curr) =>
          new Date(prev.createdAt) > new Date(curr.createdAt) ? prev : curr
        );
        setLatestProject(newLatest);
      }
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  useEffect(() => {
    fetchProjects();

    const loadModel = async () => {
      try {
        const loadedModel = await tf.loadLayersModel("/path/to/model.json");
        setModel(loadedModel);
      } catch (error) {
        console.error("Error loading model:", error);
      }
    };
    loadModel();
  }, []);

  return (
    <ProjectContext.Provider
      value={{
        projects,
        consultants,
        latestProject,
        fetchProjects,
        fetchUserProjects,
        addProject,
        updateProject,
        deleteProject,
        predictProjectCompletion,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export default ProjectProvider;
