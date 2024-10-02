import React, { useContext, useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ProjectContext } from '../../contexts/ProjectContext';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, Button } from '../Task/UIComp';

const ProjectsPage = () => {
  const { projects, fetchProjects } = useContext(ProjectContext);
  const [notificationShown, setNotificationShown] = useState(false);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        await fetchProjects();
        if (!notificationShown) {
          toast.success('Projects fetched successfully!');
          setNotificationShown(true);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
        toast.error('Failed to fetch projects.');
      }
    };

    loadProjects();
  }, [fetchProjects, notificationShown]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Projects</h1>
      <ToastContainer />
      {projects.length > 0 ? (
        projects.map((project) => (
          <Card key={project.id} className="mb-6">
            <CardHeader>
              <CardTitle>Project: {project.name || project.id}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Description: {project.description || 'No description available'}</p>
              <p>Start Date: {project.startDate ? new Date(project.startDate).toLocaleDateString() : 'N/A'}</p>
              <p>End Date: {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'N/A'}</p>
              <p>Status: {project.status || 'Unknown'}</p>
              {project.tasks && project.tasks.length > 0 ? (
                <div>
                  <h3 className="text-lg font-semibold mt-4 mb-2">Tasks:</h3>
                  {project.tasks.map((task) => (
                    <div key={task.id} className="mb-4 p-4 bg-white rounded-lg shadow">
                      <h4 className="text-md font-semibold">{task.name || 'Unnamed Task'}</h4>
                      <p>Description: {task.description || 'No description available'}</p>
                      <p>Due Date: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}</p>
                      <p>Status: {task.status || 'Unknown'}</p>
                      {task.id && (
                        <Link to={`/tasks/${task.id}`}>
                          <Button variant="outline" className="mt-2">View Task Details</Button>
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p>No tasks available for this project.</p>
              )}
              <Link to={`/projects/${project.id}`}>
                <Button variant="outline" className="mt-4">View Project Details</Button>
              </Link>
            </CardContent>
          </Card>
        ))
      ) : (
        <p>No projects available.</p>
      )}
    </div>
  );
};

export default ProjectsPage;