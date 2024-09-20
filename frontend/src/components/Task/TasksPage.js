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

export default TasksPage;
