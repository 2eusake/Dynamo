import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { TaskContext } from '../../contexts/TaskContext'; // Assuming you have TaskContext to manage tasks
import { AuthContext } from '../../contexts/AuthContext'; // Assuming you have AuthContext to manage user roles

const TaskList = () => {
  const { tasks, fetchTasks, fetchUserTasks } = useContext(TaskContext);
  const { user } = useContext(AuthContext); // Get current user from AuthContext
  const [filteredTasks, setFilteredTasks] = useState([]);

  useEffect(() => {
    const loadTasks = async () => {
      if (user.role === 'director') {
        await fetchTasks(); // Director can fetch all tasks
      } else {
        await fetchUserTasks(); // Fetch user-specific tasks for project managers and consultants
      }
    };
    
    loadTasks();
  }, [user, fetchTasks, fetchUserTasks]);

  useEffect(() => {
    // Filter tasks for project managers to show tasks in their projects
    if (user.role === 'projectManager') {
      const managerTasks = tasks.filter(task => task.project_manager_id === user.id);
      setFilteredTasks(managerTasks);
    } else {
      setFilteredTasks(tasks);
    }
  }, [tasks, user]);

  return (
    <div>
      <h3>{user.role === 'consultant' ? 'Your Tasks' : 'All Tasks'}</h3>
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
