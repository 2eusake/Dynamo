import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateProject = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    projectManagerId: '',
    wbs_code: '', // Updated to match the database field
    tasks: [{ taskId: '', name: '', startDate: '', dueDate: '', assigned_to_user_id: '', durationHours: 0 }],
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
        toast.error('Failed to fetch users.');
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    // Calculate project duration in weeks whenever startDate or endDate changes
    if (formData.start_date && formData.end_date) {
      const startDate = new Date(formData.start_date);
      const endDate = new Date(formData.end_date);
      const durationWeeks = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24 * 7));
      setProjectDurationWeeks(durationWeeks);
    }
  }, [formData.start_date, formData.end_date]);

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
      tasks: [...formData.tasks, { taskId: '', name: '', startDate: '', dueDate: '', assigned_to_user_id: '', durationHours: 0 }],
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
      toast.success('Project created successfully!');
      // Reset form
      setFormData({
        name: '',
        description: '',
        start_date: '',
        end_date: '',
        projectManagerId: '',
        wbs_code: '', // Reset new field
        tasks: [{ taskId: '', name: '', startDate: '', dueDate: '', assigned_to_user_id: '', durationHours: 0 }],
      });
      setProjectDurationWeeks(0);
    } catch (error) {
      console.error('Error creating project:', error);
      setNotification('Failed to create project.');
      toast.error('Failed to create project.');
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post('http://localhost:5000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      toast.success('File uploaded and processed successfully!');
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload file.');
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
        <input
          className="w-full p-2 mb-4 border border-gray-300 rounded"
          type="text"
          name="wbs_code"
          value={formData.wbs_code}
          onChange={handleInputChange}
          placeholder="WBS Code"
          required
        />
        <div className="flex space-x-4 mb-4">
          <input
            className="w-1/2 p-2 border border-gray-300 rounded"
            type="date"
            name="start_date"
            value={formData.start_date}
            onChange={handleInputChange}
            required
          />
          <input
            className="w-1/2 p-2 border border-gray-300 rounded"
            type="date"
            name="end_date"
            value={formData.end_date}
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
            <input
              className="w-full p-2 mb-2 border border-gray-300 rounded"
              type="text"
              value={task.taskId}
              onChange={(e) => handleTaskChange(index, 'taskId', e.target.value)}
              placeholder="Task ID"
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
                placeholder="Due Date"
                required
              />
            </div>
            <select
              className="w-full p-2 mb-2 border border-gray-300 rounded"
              value={task.assigned_to_user_id}
              onChange={(e) => handleTaskChange(index, 'assigned_to_user_id', e.target.value)}
              required
            >
              <option value="">Select Consultant</option>
              {consultants.map(consultant => (
                <option key={consultant.id} value={consultant.id}>
                  {consultant.username}
                </option>
              ))}
            </select>
            <input
              className="w-full p-2 mb-2 border border-gray-300 rounded"
              type="number"
              value={task.durationHours}
              readOnly
              placeholder="Duration Hours"
            />
            <button
              type="button"
              className="bg-red-500 text-white p-2 rounded"
              onClick={() => removeTask(index)}
            >
              Remove Task
            </button>
          </div>
        ))}
        <button
          type="button"
          className="bg-blue-500 text-white p-2 rounded mb-4"
          onClick={addTask}
        >
          Add Task
        </button>
        <button
          type="submit"
          className="bg-green-500 text-white p-2 rounded"
        >
          Create Project
        </button>
      </form>
      <div className="upload-file-container mt-6">
        <input
          type="file"
          accept=".xlsx"
          onChange={handleFileUpload}
        />
      </div>
    </div>
  );
};

export default CreateProject;
