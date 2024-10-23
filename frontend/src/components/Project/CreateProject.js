// src/components/Project/CreateProject.js

import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import apiClient from '../../utils/apiClient';
import { Plus, Minus, Upload, Calendar } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import {
  Button,
  Input,
  Textarea,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '../UIComp'; // Importing UIComp components for consistent styling

const CreateProject = () => {
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    projectManagerId: '',
    directorId: '',
    wbsElement: '',
    tasks: [],
  });
  const { isDarkMode } = useTheme();

  const [users, setUsers] = useState({
    consultants: [],
    projectManagers: [],
    directors: [],
  });
  const [notification, setNotification] = useState('');
  const [projectDurationWeeks, setProjectDurationWeeks] = useState(0);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await apiClient.get('/users');
        const { consultants, projectManagers, directors } = response.data;
        setUsers({ consultants, projectManagers, directors });
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error('Failed to fetch users.');
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
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
      setFormData((prevState) => ({
        ...prevState,
        tasks: prevState.tasks.map((task, index) =>
          index === taskIndex ? { ...task, [name]: value } : task
        ),
      }));
    } else {
      setFormData((prevState) => ({ ...prevState, [name]: value }));
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
      tasks: [
        ...formData.tasks,
        {
          taskId: '',
          taskName: '',
          description: '',
          start_date: '',
          due_date: '',
          assigned_to_user_id: '',
          hours: '',
        },
      ],
    });
  };

  const removeTask = (index) => {
    const newTasks = formData.tasks.filter((_, idx) => idx !== index);
    setFormData({ ...formData, tasks: newTasks });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Project name is required.');
      return;
    }
    if (!formData.startDate || !formData.endDate) {
      toast.error('Start date and end date are required.');
      return;
    }
    if (!formData.projectManagerId) {
      toast.error('Project manager is required.');
      return;
    }
    if (!formData.directorId) {
      toast.error('Director is required.');
      return;
    }

    const validTasks = formData.tasks.filter(
      (task) => task.taskName && task.taskName.trim() !== ''
    );

    if (validTasks.length === 0) {
      toast.error('Please add at least one task with a task name.');
      return;
    }

    const dataToSend = {
      ...formData,
      tasks: validTasks,
    };

    try {
      await apiClient.post('/projects', dataToSend);
      setFormData({
        name: '',
        startDate: '',
        endDate: '',
        projectManagerId: '',
        directorId: '',
        wbsElement: '',
        tasks: [],
      });
      setProjectDurationWeeks(0);
      toast.success('Project and tasks created successfully!');
    } catch (error) {
      console.error(
        'Error creating project and tasks:',
        error.response ? error.response.data : error.message
      );
      setNotification('Failed to create project.');
      toast.error('Failed to create project.');
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formDataUpload = new FormData();
    formDataUpload.append('file', file);

    try {
      await apiClient.post('/upload', formDataUpload, {
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
    <div className={`p-6 rounded-md mb-6 shadow-sm ${isDarkMode ? 'dark' : ''}`}>
      <div className="create-project-container">
        <h2 className={`text-3xl font-bold mb-6 underline-green ${isDarkMode ? 'text-white' : 'text-darkGray'}`}>
          Create New Project
        </h2>
        {notification && <div className="notification">{notification}</div>}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="wbsElement">WBS Element</label>
              <Input
                id="wbsElement"
                type="text"
                name="wbsElement"
                value={formData.wbsElement}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label htmlFor="name">Project Name</label>
              <Input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="projectManagerId">Project Manager</label>
              <select
                name="projectManagerId"
                value={formData.projectManagerId}
                onChange={handleInputChange}
                required
                className="block w-full bg-white border border-gray-300 rounded-md shadow-sm p-3"
              >
                <option value="">Select Project Manager</option>
                {users.projectManagers.map((pm) => (
                  <option key={pm.id} value={pm.id}>
                    {pm.username}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="directorId">Director</label>
              <select
                name="directorId"
                value={formData.directorId}
                onChange={handleInputChange}
                required
                className="block w-full bg-white border border-gray-300 rounded-md shadow-sm p-3"
              >
                <option value="">Select Director</option>
                {users.directors.map((director) => (
                  <option key={director.id} value={director.id}>
                    {director.username}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="startDate">Start Date</label>
              <Input
                id="startDate"
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label htmlFor="endDate">End Date</label>
              <Input
                id="endDate"
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label htmlFor="duration">Project Duration (Weeks)</label>
              <Input
                id="duration"
                type="number"
                value={projectDurationWeeks}
                readOnly
                className="bg-gray-100 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Tasks Section */}
          <div className="task-section">
            <h3 className= {`text-2xl font-semibold mb-4  underline-green ${isDarkMode ? ' text-white' : ' text-black'}`} >Tasks</h3>

         
            {formData.tasks.map((task, index) => (
              <Card key={index} className="mb-6 ">
                <CardHeader>
                  <CardTitle className= {` flex justify-between items-center ${isDarkMode ? ' text-white' : ' text-black'}`}>
                    <span>Task {index + 1}</span>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => removeTask(index)}
                      className="flex items-center"
                    >
                      <Minus size={16} className="mr-1" />
                      Remove Task
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor={`taskId-${index}`}>Task ID</label>
                      <Input
                        id={`taskId-${index}`}
                        type="text"
                        name="taskId"
                        value={task.taskId}
                        onChange={(e) => handleTaskChange(index, 'taskId', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor={`taskName-${index}`}>Task Name</label>
                      <Input
                        id={`taskName-${index}`}
                        type="text"
                        name="taskName"
                        value={task.taskName}
                        onChange={(e) => handleTaskChange(index, 'taskName', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor={`description-${index}`}>Description</label>
                    <Textarea
                      id={`description-${index}`}
                      value={task.description}
                      onChange={(e) => handleTaskChange(index, 'description', e.target.value)}
                      rows="3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor={`start_date-${index}`}>Start Date</label>
                      <Input
                        id={`start_date-${index}`}
                        type="date"
                        name="start_date"
                        value={task.start_date}
                        onChange={(e) => handleTaskChange(index, 'start_date', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor={`due_date-${index}`}>Due Date</label>
                      <Input
                        id={`due_date-${index}`}
                        type="date"
                        name="due_date"
                        value={task.due_date}
                        onChange={(e) => handleTaskChange(index, 'due_date', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor={`assigned_to_user_id-${index}`}>Assigned Consultant</label>
                      <select
                        id={`assigned_to_user_id-${index}`}
                        name="assigned_to_user_id"
                        value={task.assigned_to_user_id}
                        onChange={(e) => handleTaskChange(index, 'assigned_to_user_id', e.target.value)}
                        className="block w-full bg-white border border-gray-300 rounded-md shadow-sm p-3"
                      >
                        <option value="">Select Consultant</option>
                        {users.consultants.map((consultant) => (
                          <option key={consultant.id} value={consultant.id}>
                            {consultant.username}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor={`hours-${index}`}>Allocated Hours</label>
                      <Input
                        id={`hours-${index}`}
                        type="number"
                        name="hours"
                        value={task.hours}
                        onChange={(e) => handleTaskChange(index, 'hours', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            <Button type="button" onClick={addTask} variant="default">
              <Plus size={20} className="mr-2" />
              Add Task
            </Button>
          </div>

          {/* File Upload and Submit */}
          <div className="flex justify-between items-center mt-8">
            <div className="relative">
              <input
                type="file"
                accept=".csv,.xlsx"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex items-center px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
              >
                <Upload size={20} className="mr-2" />
                Upload File
              </label>
            </div>

            <Button
              type="submit"
              variant="default"
              className="px-8 py-4 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300 text-lg font-semibold"
            >
              Create Project
            </Button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default CreateProject;

