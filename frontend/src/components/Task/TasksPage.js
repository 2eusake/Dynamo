import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './TasksPage.css'; 

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  //const [notification, setNotification] = useState('');

  useEffect(() => {
    // Fetch tasks for the logged-in user
    const fetchTasks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/tasks/user', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        // Log the response to check the data
        console.log('Fetched tasks:', response.data);

        setTasks(response.data);
        toast.success('Tasks fetched successfully!');
      } catch (error) {
        console.error('Error fetching tasks:', error);
        toast.error('Failed to fetch tasks.');
      }
    };

    fetchTasks();
  }, []);

  // Check the format of tasks data
  console.log('Tasks state:', tasks);

  // Group tasks by project
  const groupedTasks = tasks.reduce((acc, task) => {
    if (!acc[task.project_id]) {
      acc[task.project_id] = { project_id: task.project_id, tasks: [] };
    }
    acc[task.project_id].tasks.push(task);
    return acc;
  }, {});

  return (
    <div className="tasks-page">
      <h1>Tasks</h1>
      <div className="projects-container">
        {Object.keys(groupedTasks).length > 0 ? (
          Object.values(groupedTasks).map(projectGroup => (
            <div key={projectGroup.project_id} className="project-tasks">
              <h2>Project ID: {projectGroup.project_id}</h2>
              <div className="tasks-container">
                {projectGroup.tasks.length > 0 ? (
                  projectGroup.tasks.map(task => (
                    <div key={task.id} className="task-tile">
                      <Link to={`/tasks/${task.id}`}>
                        <h3>{task.name}</h3>
                        <p>Status: {task.status}</p>
                      </Link>
                    </div>
                  ))
                ) : (
                  <p>No tasks available for this project.</p>
                )}
              </div>
            </div>
          ))
        ) : (
          <p>No tasks available.</p>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default TasksPage;
