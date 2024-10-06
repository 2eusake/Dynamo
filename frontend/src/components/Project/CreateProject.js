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
    directors: []
  });
  const [notification, setNotification] = useState('');
  const [projectDurationWeeks, setProjectDurationWeeks] = useState(0);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await apiClient.get('/users');
        const { consultants, projectManagers, directors } = response.data; // Ensure response is structured this way
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
      setFormData(prevState => ({
        ...prevState,
        tasks: prevState.tasks.map((task, index) =>
          index === taskIndex ? { ...task, [name]: value } : task
        )
      }));
    } else {
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
    // Validate that all required project fields are filled
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

    // Filter out tasks that don't have a taskName
    const validTasks = formData.tasks.filter(task => task.taskName && task.taskName.trim() !== '');

    // Check if there are valid tasks
    if (validTasks.length === 0) {
      toast.error('Please add at least one task with a task name.');
      return;
    }

    // Prepare data to send
    const dataToSend = {
      ...formData,
      tasks: validTasks,
    };

    try {
      // Post the project along with valid tasks
      await apiClient.post('/projects', dataToSend);

      // Reset form data
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
      console.error('Error creating project and tasks:', error.response ? error.response.data : error.message);
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
   
      <div  className= {`  p-6 rounded-md mb-6 shadow-sm 4 ${isDarkMode ? 'bg-black-600 text-white' : 'bg-gray-50 text-black'}`}>
      <div className= "grid grid-cols-1 md:grid-cols-2 gap-6 mb"> 
      <div className="create-project-container">
        <h2 className={`  text-3xl font-bold mb-6 underline-green ${isDarkMode ? 'text-white' : 'text-darkGray'}`}>Create New Project</h2>
        {notification && <div className="notification">{notification}</div>}
        <form onSubmit={handleSubmit}>
          <div className="input-grid">
            <div>
              <label htmlFor="wbsElement">WBS Element</label>
              <input
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
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
    <div className={`container mx-auto p-4 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
      <Card className="max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-md p-8">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center mb-6">Create New Project</CardTitle>
        </CardHeader>
        <CardContent>
          {notification && (
            <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
              {notification}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Project Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="wbsElement" className="block text-sm font-medium text-gray-700 mb-2">
                  WBS Element
                </label>
                <Input
                  id="wbsElement"
                  type="text"
                  name="wbsElement"
                  value={formData.wbsElement}
                  onChange={handleInputChange}
                  required
                  className="w-full"
                />
              </div>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Project Name
                </label>
                <Input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="projectManagerId" className="block text-sm font-medium text-gray-700 mb-2">
                  Project Manager
                </label>
                <select
                  name="projectManagerId"
                  value={formData.projectManagerId}
                  onChange={handleInputChange}
                  required
                  className="block w-full bg-white border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-3"
                >
                  <option value="">Select Project Manager</option>
                  {users.projectManagers.map(pm => (
                    <option key={pm.id} value={pm.id}>
                      {pm.username}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="directorId" className="block text-sm font-medium text-gray-700 mb-2">
                  Director
                </label>
                <select
                  name="directorId"
                  value={formData.directorId}
                  onChange={handleInputChange}
                  required
                  className="block w-full bg-white border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-3"
                >
                  <option value="">Select Director</option>
                  {users.directors.map(director => (
                    <option key={director.id} value={director.id}>
                      {director.username}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <div className="relative">
                  <Input
                    id="startDate"
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    required
                    className="pl-10"
                  />
                  <Calendar className="absolute left-3 top-3 text-gray-400" size={20} />
                </div>
              </div>
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <div className="relative">
                  <Input
                    id="endDate"
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    required
                    className="pl-10"
                  />
                  <Calendar className="absolute left-3 top-3 text-gray-400" size={20} />
                </div>
              </div>
              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
                  Project Duration (Weeks)
                </label>
                <Input
                  id="duration"
                  type="number"
                  value={projectDurationWeeks}
                  readOnly
                  className="bg-gray-100 cursor-not-allowed"
                />
              </div>
            </div>

          <div className={`task-section p-6 rounded-md mb-6 shadow-sm 4 ${isDarkMode ? 'bg-black-600 text-white' : 'bg-gray-50 text-gray-700'}`}>
            
            {formData.tasks.map((task, index) => (
                <div key={index} className={`task-card ${isDarkMode ? 'bg-black ' : 'bg-gray-50 '}`}>
                
                <div className="input-grid" >
                  <div>
                    <label htmlFor={`taskId-${index}`}>Task ID</label>
                    <input
                      id={`taskId-${index}`}
                      type="text"
                      value={task.taskId}
                      onChange={(e) => handleTaskChange(index, 'taskId', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor={`taskName-${index}`}>Task Name</label>
                    <input
                      id={`taskName-${index}`}
                      type="text"
                      value={task.taskName}
                      onChange={(e) => handleTaskChange(index, 'taskName', e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor={`description-${index}`}>Description</label>
                  <textarea
                    id={`description-${index}`}
                    value={task.description}
                    onChange={(e) => handleTaskChange(index, 'description', e.target.value)}
                    rows="3"
                    required
                  />
                </div>
                <div className="input-grid">
                  <div>
                    <label htmlFor={`startDate-${index}`}>Start Date</label>
                    <input
                      id={`startDate-${index}`}
                      type="date"
                      value={task.start_date}
                      onChange={(e) => handleTaskChange(index, 'start_date', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor={`dueDate-${index}`}>Due Date</label>
                    <input
                      id={`dueDate-${index}`}
                      type="date"
                      value={task.due_date}
                      onChange={(e) => handleTaskChange(index, 'due_date', e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="input-grid">
                  <div>
                    <label htmlFor={`consultant-${index}`}>Assigned Consultant</label>
                    <select
                      name="consultantId"
                      value={task.assigned_to_user_id}
                      onChange={(e) => handleTaskChange(index, 'assigned_to_user_id', e.target.value)}
                    >
                      <option value="">Select Consultant</option>
                      {users.consultants.map(consultant => (
                        <option key={consultant.id} value={consultant.id}>
                          {consultant.username}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor={`hours-${index}`}>Allocated Hours</label>
                    <input
                      id={`hours-${index}`}
                      type="number"
                      value={task.hours}
                      onChange={(e) => handleTaskChange(index, 'hours', e.target.value)}
                      required
                    />
                  </div>
                </div>
                <button
                  type="button"
                  className="remove-task-button"
                  onClick={() => removeTask(index)}
            {/* Tasks Section */}
            <div>
              <h3 className="text-2xl font-semibold mb-4">Tasks</h3>
              {formData.tasks.map((task, index) => (
                <Card key={index} className="mb-6">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
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
                        <label htmlFor={`taskId-${index}`} className="block text-sm font-medium text-gray-700 mb-2">
                          Task ID
                        </label>
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
                        <label htmlFor={`taskName-${index}`} className="block text-sm font-medium text-gray-700 mb-2">
                          Task Name
                        </label>
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

                    <div className="mb-4">
                      <label htmlFor={`description-${index}`} className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <Textarea
                        id={`description-${index}`}
                        name="description"
                        value={task.description}
                        onChange={(e) => handleTaskChange(index, 'description', e.target.value)}
                        rows="3"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                      <div>
                        <label htmlFor={`start_date-${index}`} className="block text-sm font-medium text-gray-700 mb-2">
                          Start Date
                        </label>
                        <div className="relative">
                          <Input
                            id={`start_date-${index}`}
                            type="date"
                            name="start_date"
                            value={task.start_date}
                            onChange={(e) => handleTaskChange(index, 'start_date', e.target.value)}
                            required
                            className="pl-10"
                          />
                          <Calendar className="absolute left-3 top-3 text-gray-400" size={20} />
                        </div>
                      </div>
                      <div>
                        <label htmlFor={`due_date-${index}`} className="block text-sm font-medium text-gray-700 mb-2">
                          Due Date
                        </label>
                        <div className="relative">
                          <Input
                            id={`due_date-${index}`}
                            type="date"
                            name="due_date"
                            value={task.due_date}
                            onChange={(e) => handleTaskChange(index, 'due_date', e.target.value)}
                            required
                            className="pl-10"
                          />
                          <Calendar className="absolute left-3 top-3 text-gray-400" size={20} />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                      <div>
                        <label htmlFor={`assigned_to_user_id-${index}`} className="block text-sm font-medium text-gray-700 mb-2">
                          Assigned Consultant
                        </label>
                        <select
                          name="assigned_to_user_id"
                          id={`assigned_to_user_id-${index}`}
                          value={task.assigned_to_user_id}
                          onChange={(e) => handleTaskChange(index, 'assigned_to_user_id', e.target.value)}
                          className="block w-full bg-white border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-3"
                        >
                          <option value="">Select Consultant</option>
                          {users.consultants.map(consultant => (
                            <option key={consultant.id} value={consultant.id}>
                              {consultant.username}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label htmlFor={`hours-${index}`} className="block text-sm font-medium text-gray-700 mb-2">
                          Allocated Hours
                        </label>
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

              <Button
                type="button"
                onClick={addTask}
                variant="default"
                className="flex items-center"
              >
                <Plus size={20} className="mr-2" />
                Add Task
              </Button>
            </div>

            {/* File Upload and Submit */}
            <div className="flex justify-between items-center">
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
            ))}
            
          </div>
          

          <div className="form-footer">
          <button type="button" className="add-task-button" onClick={addTask}>
              <Plus size={20} /> Add Task
            </button>
            <button type="submit" className="submit-button">Create Project</button>
          </div>
        </form>
      </div>
      
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
        </CardContent>
      </Card>
      <ToastContainer />
    </div>
  );
};

export default CreateProject;
