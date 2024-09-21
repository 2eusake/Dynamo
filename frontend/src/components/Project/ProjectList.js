import React, { useState, useEffect, useContext } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import apiClient from '../../utils/apiClient';
import { Link } from 'react-router-dom';
import './ProjectsList.css';
import { AuthContext } from '../../contexts/AuthContext';
import axios from 'axios';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const { refreshToken } = useContext(AuthContext);
  const [notificationShown, setNotificationShown] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = await refreshToken();
        if (!token) {
          console.log('No valid token available. Cannot fetch projects.');
          toast.error('Error: Unable to fetch projects due to authentication issues.');
          return;
        }

        const response = await apiClient.get('/projects', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setProjects(response.data);

        if (!notificationShown) {
          toast.success('Projects fetched successfully!');
          setNotificationShown(true);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
        toast.error('Failed to fetch projects.');
      }
    };

    fetchProjects();
  }, [refreshToken, notificationShown]);
  
  const groupedProjects = projects.reduce((acc, project) => {
    const projectId = project.id || 'Unassigned';
    if (!acc[projectId]) {
      acc[projectId] = { project_id: projectId, tasks: [] };
    }
    if (project.tasks && project.tasks.length > 0) {
      acc[projectId].tasks.push(...project.tasks);
    }
    return acc;
  }, {});

  return (
    <div className="projects-page">
      <h1>Projects and Tasks</h1>
      <ToastContainer />

      <div className="tiles-container">
        {Object.keys(groupedProjects).length > 0 ? (
          Object.values(groupedProjects).map((projectGroup) => (
            <div key={projectGroup.project_id} className="tile">
              <h2>Project ID: {projectGroup.project_id}</h2>
              {projectGroup.tasks.length > 0 ? (
                projectGroup.tasks.map((task) => (
                  <div key={task.id} className="task-item">
                    <Link to={`/tasks/${task.id}`}>
                      <h3>{task.name}</h3>
                      <p>Description: {task.description || 'No description available'}</p>
                      <p>Due Date: {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'N/A'}</p>
                      <p>Hours Allocated: {task.hours || 'N/A'}</p>
                      <p>Task ID: {task.id || 'N/A'}</p>
                      <p>Status: {task.status || 'Not started'}</p>
                      <p>Assigned To: {task.assigned_to_user_id || 'Unassigned'}</p>
                    </Link>
                  </div>
                ))
              ) : (
                <p>No tasks available for this project.</p>
              )}
            </div>
          ))
        ) : (
          <p>No projects available.</p>
        )}
      </div>
    </div>
  );
};

export default ProjectsPage;
