import React, { useContext, useEffect, useState } from 'react';
import apiClient from '../../apiClient';
import { TaskContext } from '../../contexts/TaskContext'; // Assuming you have TaskContext to manage tasks
import { AuthContext } from '../../contexts/AuthContext'; // Assuming you have AuthContext to manage user roles

const TaskList = () => {
  const { tasks, setTasks } = useContext(TaskContext);
  const { user } = useContext(AuthContext); // Get current user from AuthContext
  const [filteredTasks, setFilteredTasks] = useState([]);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        if (user.role === 'Director') {
          const response = await apiClient.get('/tasks'); // Fetch all tasks for Director
          setTasks(response.data);
        } else {
          const response = await apiClient.get(`/tasks/user/${user.id}`); // Fetch user-specific tasks
          setTasks(response.data);
        }
      } catch (error) {
        console.error("Failed to load tasks:", error);
      }
    };
    
    loadTasks();
  }, [user, setTasks]);

  useEffect(() => {
    // Filter tasks for project managers to show tasks in their projects
    if (user.role === 'Project Manager') {
      const managerTasks = tasks.filter(task => task.project_manager_id === user.id);
      setFilteredTasks(managerTasks);
    } else {
      setFilteredTasks(tasks);
    }
  }, [tasks, user]);

  return (
    <div>
      <h3>{user.role === 'Consultant' ? 'Your Tasks' : 'All Tasks'}</h3>
      <ul>
        {filteredTasks.map(task => (
          <li key={task.id}>
            {task.task_name} - {task.status} - {task.hours_allocated} hours - Assigned to: {task.assigned_to_user_id}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;


