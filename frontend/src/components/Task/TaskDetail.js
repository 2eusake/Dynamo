/*import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ProjectContext } from '../../contexts/ProjectContext';

const TaskDetail = () => {
  const { id } = useParams();
  const { projects } = useContext(ProjectContext);
  const [task, setTask] = useState(null);

  useEffect(() => {
    if (!projects || projects.length === 0) return;

    projects.forEach(project => {
      const foundTask = project.tasks.find(task => task.id === parseInt(id, 10));
      if (foundTask) setTask(foundTask);
    });
  }, [id, projects]);

  if (!task) {
    return <p className="text-deloitte-black">Loading task details...</p>;
  }

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-4xl font-bold mb-4 text-deloitte-blue">Task: {task.name}</h2>
      <p className="text-xl text-deloitte-black mb-6">
        {task.description || 'No description available'}
      </p>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xl font-semibold text-deloitte-black">Progress</span>
          <span className="text-xl font-semibold text-deloitte-black">{task.progress || 0}%</span>
        </div>
        <div className="w-full bg-gray-300 rounded-full h-4">
          <div
            className="bg-deloitte-green h-4 rounded-full"
            style={{ width: `${task.progress || 0}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;*/
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../../utils/apiClient'; // Import apiClient for API requests
import { ProjectContext } from '../../contexts/ProjectContext';

const TaskDetail = () => {
  const { id } = useParams(); // Get task ID from URL params
  const { projects } = useContext(ProjectContext); // Get projects from context
  const [task, setTask] = useState(null); // Store the task data
  const [project, setProject] = useState(null); // Store the associated project data

  useEffect(() => {
    const fetchTaskDetail = async () => {
      try {
        // Fetch task details from the API
        const response = await apiClient.get(`/tasks/${id}`);
        const taskData = response.data;
        setTask(taskData);

        // Fetch the associated project details
        const projectResponse = await apiClient.get(`/projects/${taskData.project_id}`);
        setProject(projectResponse.data);
      } catch (error) {
        console.error('Error fetching task details:', error);
      }
    };

    fetchTaskDetail();
  }, [id]);

  if (!task || !project) {
    return <p className="text-deloitte-black">Loading task details...</p>;
  }

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-4xl font-bold mb-4 text-deloitte-blue">Task: {task.task_name}</h2>
      <p className="text-xl text-deloitte-black mb-6">
        {task.description || 'No description available'}
      </p>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xl font-semibold text-deloitte-black">Progress</span>
          <span className="text-xl font-semibold text-deloitte-black">{task.progress || 0}%</span>
        </div>
        <div className="w-full bg-gray-300 rounded-full h-4">
          <div
            className="bg-deloitte-green h-4 rounded-full"
            style={{ width: `${task.progress || 0}%` }}
          ></div>
        </div>
      </div>

      {/* Additional task details */}
      <p>Due Date: {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'N/A'}</p>
      <p>Hours Allocated: {task.hours_allocated || 'N/A'}</p>
      <p>Task ID: {task.task_id || 'N/A'}</p>
      <p>Status: {task.status || 'N/A'}</p>
      <p>Assigned To: {task.assigned_to_user_id || 'Unassigned'}</p>

      {/* Project-related details */}
      <h3 className="text-2xl font-bold mt-6">Related Project Details</h3>
      <p>Project Manager ID: {project.projectManagerId || 'N/A'}</p>
      <p>Director ID: {project.directorId || 'N/A'}</p>
    </div>
  );
};

export default TaskDetail;


