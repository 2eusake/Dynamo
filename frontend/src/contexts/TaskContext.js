import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { refreshToken } from '../utils/auth';

export const TaskContext = createContext();

const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    try {
      await refreshToken(); // Refresh the token if needed
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/tasks', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const fetchUserTasks = async () => {
    try {
      await refreshToken(); // Refresh the token if needed
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/tasks/user', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching user tasks:', error);
    }
  };

  const addTask = async (task) => {
    try {
      await refreshToken(); // Refresh the token if needed
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/tasks', task, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks([...tasks, response.data]);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const updateTask = async (id, updatedTask) => {
    try {
      await refreshToken(); // Refresh the token if needed
      const token = localStorage.getItem('token');
      const response = await axios.put(`http://localhost:5000/api/tasks/${id}`, updatedTask, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(tasks.map(task => task.id === id ? response.data : task));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await refreshToken(); // Refresh the token if needed
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(tasks.filter(task => task.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <TaskContext.Provider value={{ 
      tasks, 
      fetchTasks, 
      fetchUserTasks, 
      addTask, 
      updateTask, 
      deleteTask 
    }}>
      {children}
    </TaskContext.Provider>
  );
};

export default TaskProvider;