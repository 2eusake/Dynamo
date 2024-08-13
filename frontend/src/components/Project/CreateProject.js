import React, { useState, useEffect } from 'react';
import axios from 'axios';
//import './CreateProject.css'; // Assuming you have a CSS file for styling

const CreateProject = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    projectManagerId: '',
    tasks: [{ name: '', dueDate: '', assignedToId: '' }],
  });

  const [consultants, setConsultants] = useState([]);
  const [projectManagers, setProjectManagers] = useState([]);
  const [notification, setNotification] = useState('');

  useEffect(() => {
    // Fetch consultants and project managers
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const users = response.data;
        setConsultants(users.filter(user => user.role === 'consultant'));
        setProjectManagers(users.filter(user => user.role === 'projectManager'));
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTaskChange = (index, field, value) => {
    const newTasks = [...formData.tasks];
    newTasks[index][field] = value;
    setFormData({ ...formData, tasks: newTasks });
  };

  const addTask = () => {
    setFormData({
      ...formData,
      tasks: [...formData.tasks, { name: '', dueDate: '', assignedToId: '' }],
    });
  };

  const removeTask = (index) => {
    const newTasks = formData.tasks.filter((_, idx) => idx !== index);
    setFormData({ ...formData, tasks: newTasks });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send POST request to create a new project
      await axios.post('http://localhost:5000/api/projects', formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setNotification('Project created successfully!');
      // Reset form
      setFormData({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        projectManagerId: '',
        tasks: [{ name: '', dueDate: '', assignedToId: '' }],
      });
    } catch (error) {
      console.error('Error creating project:', error);
      setNotification('Failed to create project.');
    }
  };

  return (
    <div className="create-project-container">
      <h2>Create New Project</h2>
      {notification && <div className="notification">{notification}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Project Name"
          required
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Project Description"
          required
        />
        <input
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleInputChange}
          required
        />
        <input
          type="date"
          name="endDate"
          value={formData.endDate}
          onChange={handleInputChange}
          required
        />
        <select
          name="projectManagerId"
          value={formData.projectManagerId}
          onChange={handleInputChange}
          required
        >
          <option value="">Select Project Manager</option>
          {projectManagers.map(pm => (
            <option key={pm.id} value={pm.id}>
              {pm.username}
            </option>
          ))}
        </select>
        <h3>Tasks</h3>
        {formData.tasks.map((task, index) => (
          <div key={index} className="task-container">
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
              required
            />
            <select
              value={task.assignedToId}
              onChange={(e) => handleTaskChange(index, 'assignedToId', e.target.value)}
              required
            >
              <option value="">Assign to Consultant</option>
              {consultants.map(consultant => (
                <option key={consultant.id} value={consultant.id}>
                  {consultant.username}
                </option>
              ))}
            </select>
            {index > 0 && (
              <button type="button" onClick={() => removeTask(index)}>
                Remove Task
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={addTask}>
          Add Another Task
        </button>
        <button type="submit">Create Project</button>
      </form>
    </div>
  );
};

export default CreateProject;
