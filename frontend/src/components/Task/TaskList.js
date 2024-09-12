import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { ProjectContext } from '../../contexts/ProjectContext';

const TaskList = () => {
  const { projects } = useContext(ProjectContext);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/tasks', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);

  return (
    <div>
      <h3>Tasks</h3>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            {task.task_name} - {task.status} - {task.hours_allocated} hours
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
