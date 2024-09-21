import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import apiClient from '../../utils/apiClient'; // Adjust the import path as necessary

const CreateProject = () => {
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    projectManagerId: '',
    directorId: '',
    duration: '',
    wbsElement: '',
    tasks: [{ taskId: '', taskName: '', description: '', start_date: '', due_date: '', assigned_to_user_id: '', hours: '' }],
  });

  const [consultants, setConsultants] = useState([]);
  const [projectManagers, setProjectManagers] = useState([]);
  const [directors, setDirectors] = useState([]);
  const [notification, setNotification] = useState('');
  const [projectDurationWeeks, setProjectDurationWeeks] = useState(0);

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('No token found, please log in.');
        return;
      }

      try {
        const response = await apiClient.get('/users');
        const users = response.data;
        setConsultants(users.filter(user => user.role === 'Consultant'));
        setProjectManagers(users.filter(user => user.role === 'Project Manager'));
        setDirectors(users.filter(user => user.role === 'Director'));
      } catch (error) {
        console.error('Error fetching users:', error);
        if (error.response && error.response.status === 401) {
          toast.error('Unauthorized, please log in again.');
        } else {
          toast.error('Failed to fetch users.');
        }
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    // Calculate project duration in weeks whenever startDate or endDate changes
    if (formData.startDate && formData.endDate) {
      const start_Date = new Date(formData.startDate);
      const end_Date = new Date(formData.endDate);
      const duration = Math.ceil((end_Date - start_Date) / (1000 * 60 * 60 * 24 * 7));
      setProjectDurationWeeks(duration);
    }
  }, [formData.startDate, formData.endDate]);

  const handleInputChange = (e, taskIndex = null) => {
    const { name, value } = e.target;
    if (taskIndex !== null) {
      // Handle task update
      setFormData(prevState => ({
        ...prevState,
        tasks: prevState.tasks.map((task, index) =>
          index === taskIndex ? { ...task, [name]: value } : task
        )
      }));
    } else {
      // Handle top-level form data update
      setFormData(prevState => ({ ...prevState, [name]: value }));
    }
  };

  const handleTaskChange = (index, field, value) => {
    const newTasks = [...formData.tasks];
    newTasks[index][field] = value;
    setFormData({ ...formData, tasks: newTasks });
  };

  const addTask = () => {
    setFormData({
      ...formData,
      tasks: [...formData.tasks, { taskId: '', taskName: '', description: '', start_date: '', due_date: '', assigned_to_user_id: '', hours: '' }],
    });
  };

  const removeTask = (index) => {
    const newTasks = formData.tasks.filter((_, idx) => idx !== index);
    setFormData({ ...formData, tasks: newTasks });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post('/projects', formData);
      setNotification('Project created successfully!');
      toast.success('Project created successfully!');
      setFormData({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        projectManagerId: '',
        directorId: '',
        wbsElement: '',
        tasks: [{ taskId: '', taskName: '', description: '', start_date: '', due_date: '', assigned_to_user_id: '', hours: '' }],
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
      await apiClient.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
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
        {/* WBS Element */}
        <input
          className="w-full p-2 mb-4 border border-gray-300 rounded"
          type="text"
          name="wbsElement"
          value={formData.wbsElement}
          onChange={handleInputChange}
          placeholder="WBS Element"
          required
        />

        {/* Project Name */}
        <input
          className="w-full p-2 mb-4 border border-gray-300 rounded"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Project Name"
          required
        />

        {/* Project Manager Dropdown */}
        <div className="mb-4">
          <label htmlFor="project-manager" className="block text-gray-700 font-bold mb-2">Project Manager:</label>
          <select
            id="project-manager"
            className="w-full p-2 border border-gray-300 rounded"
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
        </div>

        {/* Director Dropdown */}
        <div className="mb-4">
          <label htmlFor="director" className="block text-gray-700 font-bold mb-2">Director:</label>
          <select
            id="director"
            className="w-full p-2 border border-gray-300 rounded"
            name="directorId"
            value={formData.directorId}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Director</option>
            {directors.map(director => (
              <option key={director.id} value={director.id}>
                {director.username}
              </option>
            ))}
          </select>
        </div>

        {/* Start and End Date */}
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

        {/* Project Duration */}
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Project Duration (Weeks):</label>
          <input
            className="w-full p-2 border border-gray-300 rounded bg-gray-100"
            type="number"
            value={projectDurationWeeks}
            readOnly
          />
        </div>

        {/* Tasks */}
        <h3 className="text-xl font-bold mb-2 text-gray-700">Tasks</h3>
        {formData.tasks.map((task, index) => (
          <div key={index} className="task-container mb-4 p-4 border border-gray-300 rounded">
            <input
              className="w-full p-2 mb-2 border border-gray-300 rounded"
              type="text"
              value={task.taskId}
              onChange={(e) => handleTaskChange(index, 'taskId', e.target.value)}
              placeholder="Task ID"
              required
            />
            <input
              className="w-full p-2 mb-2 border border-gray-300 rounded"
              type="text"
              value={task.taskName}
              onChange={(e) => handleTaskChange(index, 'taskName', e.target.value)}
              placeholder="Task Name"
              required
            />
            <textarea
              className="w-full p-2 mb-2 border border-gray-300 rounded"
              value={task.description}
              onChange={(e) => handleTaskChange(index, 'description', e.target.value)}
              placeholder="Description"
              rows="3"
              required
            />
            <input
              className="w-full p-2 mb-2 border border-gray-300 rounded"
              type="date"
              value={task.start_date}
              onChange={(e) => handleTaskChange(index, 'start_date', e.target.value)}
              placeholder="Start Date"
              required
            />
            <input
              className="w-full p-2 mb-2 border border-gray-300 rounded"
              type="date"
              value={task.due_date}
              onChange={(e) => handleTaskChange(index, 'due_date', e.target.value)}
              placeholder="Due Date"
              required
            />
            <select
              className="w-full p-2 mb-2 border border-gray-300 rounded"
              value={task.assigned_to_user_id}
              onChange={(e) => handleTaskChange(index, 'assigned_to_user_id', e.target.value)}
              required
            >
              <option value="">Select Consultant</option>
              {consultants.map(c => (
                <option key={c.id} value={c.id}>
                  {c.username}
                </option>
              ))}
            </select>
            <input
              className="w-full p-2 mb-2 border border-gray-300 rounded"
              type="number"
              value={task.hours}
              onChange={(e) => handleTaskChange(index, 'hours', e.target.value)}
              placeholder="Hours"
              required
            />
            <button
              type="button"
              className="text-red-500 mt-2"
              onClick={() => removeTask(index)}
            >
              Remove Task
            </button>
          </div>
        ))}
        <button
          type="button"
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
          onClick={addTask}
        >
          Add Task
        </button>

        {/* Submit Button */}
        <button
          type="submit"
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Create Project
        </button>
      </form>

      {/* File Upload */}
      <div className="file-upload mt-6">
        <input
          type="file"
          accept=".csv,.xlsx"
          onChange={handleFileUpload}
        />
      </div>
    </div>
  );
};

export default CreateProject;
