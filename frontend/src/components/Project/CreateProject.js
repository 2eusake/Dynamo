import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { ProjectContext } from '../../contexts/ProjectContext';

const CreateProject = () => {
  const { addProject } = useContext(ProjectContext);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [projectManager, setProjectManager] = useState('');
  const [tasks, setTasks] = useState([{ name: '', dueDate: '', assignedTo: '' }]);
  const [consultants, setConsultants] = useState([]);
  const [projectManagers, setProjectManagers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}` // Assuming you're using a token stored in localStorage
          }
        });
        const users = response.data;
        setConsultants(users.filter(user => user.role === 'consultant'));
        setProjectManagers(users.filter(user => user.role === 'projectManager'));
      } catch (error) {
        console.error('Error fetching users', error);
      }
    };

    fetchUsers();
  }, []);

  const handleTaskChange = (index, key, value) => {
    const newTasks = [...tasks];
    newTasks[index][key] = value;
    setTasks(newTasks);
  };

  const addTask = () => {
    setTasks([...tasks, { name: '', dueDate: '', assignedTo: '' }]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addProject({ name, description, startDate, endDate, projectManager, tasks });
    setName('');
    setDescription('');
    setStartDate('');
    setEndDate('');
    setProjectManager('');
    setTasks([{ name: '', dueDate: '', assignedTo: '' }]);
  };

  return (
    <div>
      <h2>Create Project</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Project Name"
          required
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Project Description"
          required
        />
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          placeholder="Start Date"
          required
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          placeholder="End Date"
          required
        />
        <select
          value={projectManager}
          onChange={(e) => setProjectManager(e.target.value)}
          placeholder="Select Project Manager"
          required
        >
          <option value="">Select Project Manager</option>
          {projectManagers.map(pm => (
            <option key={pm.id} value={pm.id}>{pm.username}</option>
          ))}
        </select>
        <div>
          <h3>Tasks</h3>
          {tasks.map((task, index) => (
            <div key={index}>
              <input
                type="text"
                value={task.name}
                onChange={(e) => handleTaskChange(index, 'name', e.target.value)}
                placeholder="Task Name"
                required
              />
              <input
                type="date"
                value={task.dueDate}
                onChange={(e) => handleTaskChange(index, 'dueDate', e.target.value)}
                placeholder="Due Date"
                required
              />
              <select
                value={task.assignedTo}
                onChange={(e) => handleTaskChange(index, 'assignedTo', e.target.value)}
                placeholder="Assign to"
                required
              >
                <option value="">Assign to</option>
                {consultants.map(consultant => (
                  <option key={consultant.id} value={consultant.id}>{consultant.username}</option>
                ))}
              </select>
            </div>
          ))}
          <button type="button" onClick={addTask}>Add Task</button>
        </div>
        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default CreateProject;
