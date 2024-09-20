import React, { createContext, useState, useEffect } from 'react';
import apiClient from '../utils/apiClient'; // Import the centralized API client

export const TaskContext = createContext();

const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    try {
      const role = localStorage.getItem('role');
      let tasksUrl = '/tasks';

      if (role === 'Consultant') {
        tasksUrl = '/tasks/user';
      }

      const response = await apiClient.get(tasksUrl);
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const fetchUserTasks = async () => {
    try {
      const response = await apiClient.get('/tasks/user');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching user tasks:', error);
    }
  };

  const addTask = async (task) => {
    try {
      const response = await apiClient.post('/tasks', task);
      setTasks([...tasks, response.data]);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const updateTask = async (id, updatedTask) => {
    try {
      const response = await apiClient.put(`/tasks/${id}`, updatedTask);
      setTasks(tasks.map(task => task.id === id ? response.data : task));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await apiClient.delete(`/tasks/${id}`);
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
