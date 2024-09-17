import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateProject = () => {
  const [formData, setFormData] = useState({
    name: '',
    //description: '',
    startDate: '',
    endDate: '',
    projectManagerId: '',
    directorId:'',
   duration:'',
    wbsElement: '', // Updated to match the database field
    tasks: [{ taskId: '', taskIdame: '', description:'', start_date: '', due_date: '', assigned_to_user_id: '', hours:''}],
  });

  const [consultants, setConsultants] = useState([]);
  const [projectManagers, setProjectManagers] = useState([]);
  const [Directors, setDirectors] = useState([]);
  const [notification, setNotification] = useState('');
  const [projectDurationWeeks, setProjectDurationWeeks] = useState(0);

  useEffect(() => {
    // Fetch consultants and project managers
    const fetchUsers = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('No token found, please log in.');
        return;
      }
  
      try {
        const response = await axios.get('http://localhost:5000/api/users', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const users = response.data;
        setConsultants(users.filter(user => user.role === 'consultant'));
        setProjectManagers(users.filter(user => user.role === 'projectManager'));
        setDirectors(users.filter(user => user.role === 'director'));
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
      setProjectDurationWeeks(duration );
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

    // if (field === 'dueDate' || field === 'startDate') {
    //   const taskStartDate = newTasks[index].startDate ? new Date(newTasks[index].startDate) : null;
    //   const taskDueDate = newTasks[index].dueDate ? new Date(newTasks[index].dueDate) : null;
    //   if (taskStartDate && taskDueDate) {
    //     const durationHours = Math.ceil((taskDueDate - taskStartDate) / (1000 * 60 * 60));
    //     newTasks[index].durationHours = durationHours;
    //   }
    // }

    // setFormData({ ...formData, tasks: newTasks });
  };

  const addTask = () => {
    setFormData({
      ...formData,
      tasks: [...formData.tasks, { taskId: '', taskName: '', description:'',start_date: '', due_date: '', assigned_to_user_id: '', hours:''}],
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
        startDate: '',
        endDate: '',
        projectManagerId: '',
        directorId:'',
        wbsElement: '', // Reset new field
        tasks: [{ taskId: '', taskName: '',description:'', start_date: '', due_date: '', assigned_to_user_id: '', hours:''}],
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
          name="wbs_code"
          value={formData.wbsElement}
          onChange={handleInputChange}
          placeholder="WBS Element"
          required
        />
        <input
          className="w-full p-2 mb-4 border border-gray-300 rounded"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Project Name"
          required
        />
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
        <select
  className="w-full p-2 mb-4 border border-gray-300 rounded"
  name="directorId"
  value={formData.directorId}
  onChange={handleInputChange}
  required
>
  <option value="">Select Director</option>
  {Directors.map(director => (
    <option key={director.id} value={director.id}>
      {director.username}
    </option>
  ))}
</select>
        
        
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
            // onChange={(e) => handleTaskChange(index, 'duration', e.target.value)}
            readOnly
          />
        </div>
       
        <h3 className="text-xl font-bold mb-2 text-gray-700">Tasks</h3>
        {formData.tasks.map((task, index) => (
          <div key={index} className="task-container mb-4 p-4 bg-gray-50 rounded-lg shadow-inner">
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
          className="w-full p-2 mb-4 border border-gray-300 rounded"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Task Description"
          required
        />
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
            
            <div className="flex space-x-4 mb-2">
              <input
                className="w-1/2 p-2 border border-gray-300 rounded"
                type="date"
                value={task.start_date}
                onChange={(e) => handleTaskChange(index, 'start_date', e.target.value)}
                placeholder="Start Date"
                required
              />
              <input
                className="w-1/2 p-2 border border-gray-300 rounded"
                type="date"
                value={task.due_date}
                onChange={(e) => handleTaskChange(index, 'due_date', e.target.value)}
                placeholder="Due Date"
                required
              />
            </div>
            
            <input
              className="w-full p-2 mb-2 border border-gray-300 rounded"
              type="number"
              value={task.hours}
              onChange={(e) => handleTaskChange(index, 'hours', e.target.value)}
              placeholder="allocated Hours"
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
