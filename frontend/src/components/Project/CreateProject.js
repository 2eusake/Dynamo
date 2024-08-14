import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CreateProject = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    projectManagerId: '',
    tasks: [{ name: '', dueDate: '', assignedToId: '', durationHours: 0 }],
  });

  const [consultants, setConsultants] = useState([]);
  const [projectManagers, setProjectManagers] = useState([]);
  const [notification, setNotification] = useState('');
  const [projectDurationWeeks, setProjectDurationWeeks] = useState(0);

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

  useEffect(() => {
    // Calculate project duration in weeks whenever startDate or endDate changes
    if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      const durationWeeks = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24 * 7));
      setProjectDurationWeeks(durationWeeks);
    }
  }, [formData.startDate, formData.endDate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTaskChange = (index, field, value) => {
    const newTasks = [...formData.tasks];
    newTasks[index][field] = value;

    if (field === 'dueDate' || field === 'startDate') {
      const taskStartDate = newTasks[index].startDate ? new Date(newTasks[index].startDate) : null;
      const taskDueDate = newTasks[index].dueDate ? new Date(newTasks[index].dueDate) : null;
      if (taskStartDate && taskDueDate) {
        const durationHours = Math.ceil((taskDueDate - taskStartDate) / (1000 * 60 * 60));
        newTasks[index].durationHours = durationHours;
      }
    }

    setFormData({ ...formData, tasks: newTasks });
  };

  const addTask = () => {
    setFormData({
      ...formData,
      tasks: [...formData.tasks, { name: '', dueDate: '', assignedToId: '', durationHours: 0 }],
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
        start_date: '',
        end_date: '',
        projectManagerId: '',
        tasks: [{ name: '', dueDate: '', assignedToId: '', durationHours: 0 }],
      });
      setProjectDurationWeeks(0);
    } catch (error) {
      console.error('Error creating project:', error);
      setNotification('Failed to create project.');
    }
  };

  return (
    <div className="create-project-container p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Create New Project</h2>
      {notification && <div className="notification mb-4 p-2 bg-green-100 text-green-700 rounded">{notification}</div>}
      <form onSubmit={handleSubmit}>
        <input
          className="w-full p-2 mb-4 border border-gray-300 rounded"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Project Name"
          required
        />
        <textarea
          className="w-full p-2 mb-4 border border-gray-300 rounded"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Project Description"
          required
        />
        <div className="flex space-x-4 mb-4">
          <input
            className="w-1/2 p-2 border border-gray-300 rounded"
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleInputChange}
            required
          />
          <input
            className="w-1/2 p-2 border border-gray-300 rounded"
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Project Duration (Weeks):</label>
          <input
            className="w-full p-2 border border-gray-300 rounded bg-gray-100"
            type="number"
            value={projectDurationWeeks}
            readOnly
          />
        </div>
        <select
          className="w-full p-2 mb-4 border border-gray-300 rounded"
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
        <h3 className="text-xl font-bold mb-2 text-gray-700">Tasks</h3>
        {formData.tasks.map((task, index) => (
          <div key={index} className="task-container mb-4 p-4 bg-gray-50 rounded-lg shadow-inner">
            <input
              className="w-full p-2 mb-2 border border-gray-300 rounded"
              type="text"
              value={task.name}
              onChange={(e) => handleTaskChange(index, 'name', e.target.value)}
              placeholder="Task Name"
              required
            />
            <div className="flex space-x-4 mb-2">
              <input
                className="w-1/2 p-2 border border-gray-300 rounded"
                type="date"
                value={task.startDate}
                onChange={(e) => handleTaskChange(index, 'startDate', e.target.value)}
                placeholder="Start Date"
                required
              />
              <input
                className="w-1/2 p-2 border border-gray-300 rounded"
                type="date"
                value={task.dueDate}
                onChange={(e) => handleTaskChange(index, 'dueDate', e.target.value)}
                required
              />
            </div>
            <div className="mb-2">
              <label className="block text-gray-700 font-bold mb-1">Task Duration (Hours):</label>
              <input
                className="w-full p-2 border border-gray-300 rounded bg-gray-100"
                type="number"
                value={task.durationHours}
                readOnly
              />
            </div>
            <select
              className="w-full p-2 mb-2 border border-gray-300 rounded"
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
              <button
                type="button"
                onClick={() => removeTask(index)}
                className="text-red-500 hover:text-red-700"
              >
                Remove Task
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addTask}
          className="w-full mb-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Another Task
        </button>
        <button
          type="submit"
          className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Create Project
        </button>
      </form>
    </div>
  );
};

export default CreateProject;
