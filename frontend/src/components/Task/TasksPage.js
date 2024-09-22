/*import React, { useContext, useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { TaskContext } from '../../contexts/TaskContext';
import './TasksPage.css';

const TasksPage = () => {
  const { tasks, fetchTasks } = useContext(TaskContext);
  const [notificationShown, setNotificationShown] = useState(false);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        await fetchTasks();
        if (!notificationShown) {
          toast.success('Tasks fetched successfully!');
          setNotificationShown(true);
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
        toast.error('Failed to fetch tasks.');
      }
    };

    loadTasks();
  }, [fetchTasks, notificationShown]);

  const groupedTasks = tasks.reduce((acc, task) => {
    const projectId = task.project_id || 'Unassigned';
    if (!acc[projectId]) {
      acc[projectId] = { project_id: projectId, tasks: [] };
    }
    acc[projectId].tasks.push(task);
    return acc;
  }, {});

  return (
    <div className="tasks-page">
      <h1>Tasks</h1>
      <ToastContainer />
      {Object.keys(groupedTasks).length > 0 ? (
        Object.values(groupedTasks).map((projectGroup) => (
          <div key={projectGroup.project_id} className="project-group">
            <h2>Project ID: {projectGroup.project_id}</h2>
            {projectGroup.tasks.length > 0 ? (
              projectGroup.tasks.map((task) => (
                <div key={task.task_id} className="task-item">
                  <h3>{task.name}</h3>
                  <p>Description: {task.description || 'No description available'}</p>
                  <p>Due Date: {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'N/A'}</p>
                  <p>Hours Allocated: {task.durationHours || 'N/A'}</p>
                  <p>Task ID: {task.task_id || 'N/A'}</p>
                  <p>Status: {task.status}</p>
                  <p>Assigned To User ID: {task.assigned_to_user_id || 'Unassigned'}</p>
                </div>
              ))
            ) : (
              <p>No tasks available for this project.</p>
            )}
          </div>
        ))
      ) : (
        <p>No tasks available.</p>
      )}
    </div>
  );
};

export default TasksPage;*/
import React, { useContext, useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { TaskContext } from '../../contexts/TaskContext';
import './TasksPage.css';

const TasksPage = () => {
  const { tasks, fetchTasks } = useContext(TaskContext);
  const [notificationShown, setNotificationShown] = useState(false);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        await fetchTasks();
        if (!notificationShown) {
          toast.success('Tasks fetched successfully!');
          setNotificationShown(true);
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
        toast.error('Failed to fetch tasks.');
      }
    };

    loadTasks();
  }, [fetchTasks, notificationShown]);

  const groupedTasks = tasks.reduce((acc, task) => {
    const projectId = task.project_id || 'Unassigned';
    if (!acc[projectId]) {
      acc[projectId] = { project_id: projectId, tasks: [] };
    }
    acc[projectId].tasks.push(task);
    return acc;
  }, {});

  return (
    <div className="tasks-page p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Tasks</h1>
      <ToastContainer />
      {Object.keys(groupedTasks).length > 0 ? (
        Object.values(groupedTasks).map((projectGroup) => (
          <div key={projectGroup.project_id} className= "project-group bg-white shadow-md rounded-lg p-4 mb-4">
            <h2 className="text-xl font-semibold">Project ID: {projectGroup.project_id}</h2>
            {projectGroup.tasks.length > 0 ? (
              projectGroup.tasks.map((task) => (
                <div key={task.task_id} className="task-item border p-3 rounded-md mb-2 bg-green-50">
                  <h3 className="font-bold">{task.name}</h3>
                  <p className="text-gray-700">Description: {task.description || 'No description available'}</p>
                  <p className="text-gray-700">Due Date: {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'N/A'}</p>
                  <p className="text-gray-700">Hours Allocated: {task.durationHours || 'N/A'}</p>
                  <p className="text-gray-700">Task ID: {task.task_id || 'N/A'}</p>
                  <p className="text-gray-700">Status: {task.status}</p>
                  <p className="text-gray-700">Assigned To User ID: {task.assigned_to_user_id || 'Unassigned'}</p>
                </div>
              ))
            ) : (
              <p>No tasks available for this project.</p>
            )}
          </div>
        ))
      ) : (
        <p>No tasks available.</p>
      )}
    </div>
  );
};

export default TasksPage;
