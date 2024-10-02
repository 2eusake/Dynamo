import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import apiClient from '../../utils/apiClient'; // Adjust the import path as necessary
import { Plus, Minus, Upload, Calendar } from 'lucide-react';

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

  
  // const [consultants, setConsultants] = useState([]);
  // const [projectManagers, setProjectManagers] = useState([]);
  // const [directors, setDirectors] = useState([]);
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
        setUsers(response.data);  // Sets consultants, projectManagers, directors from API response
      } catch (error) {
        console.error('Error fetching users:', error);
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
    <div className="flex-1 bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-bold mb-8 text-blue-600 text-center">Create New Project</h2>
        {notification && (
          <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-md">
            {notification}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label htmlFor="wbsElement" className="block text-sm font-medium text-gray-700 mb-2">
                WBS Element
              </label>
              <input
                id="wbsElement"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                type="text"
                name="wbsElement"
                value={formData.wbsElement}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Project Name
              </label>
              <input
                id="name"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label htmlFor="project-manager" className="block text-sm font-medium text-gray-700 mb-2">
                Project Manager
              </label>
              <select name="projectManagerId">
        <option value="">Select Project Manager</option>
        {users.projectManagers.map((pm) => (
          <option key={pm.id} value={pm.id}>
            {pm.username}
          </option>
        ))}
      </select>
            </div>
            <div>
              <label htmlFor="director" className="block text-sm font-medium text-gray-700 mb-2">
                Director
              </label>
              <select name="directorId">
        <option value="">Select Director</option>
        {users.directors.map((director) => (
          <option key={director.id} value={director.id}>
            {director.username}
          </option>
        ))}
      </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <div className="relative">
                <input
                  id="startDate"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pl-10"
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  required
                />
                <Calendar className="absolute left-3 top-3 text-gray-400" size={20} />
              </div>
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <div className="relative">
                <input
                  id="endDate"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pl-10"
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  required
                />
                <Calendar className="absolute left-3 top-3 text-gray-400" size={20} />
              </div>
            </div>
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
                Project Duration (Weeks)
              </label>
              <input
                id="duration"
                className="w-full p-3 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                type="number"
                value={projectDurationWeeks}
                readOnly
              />
            </div>
          </div>

          <div className="mt-10">
            <h3 className="text-2xl font-semibold mb-6 text-blue-600 text-center">Tasks</h3>
            {formData.tasks.map((task, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-md mb-6 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <div>
                    <label htmlFor={`taskId-${index}`} className="block text-sm font-medium text-gray-700 mb-2">
                      Task ID
                    </label>
                    <input
                      id={`taskId-${index}`}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      type="text"
                      value={task.taskId}
                      onChange={(e) => handleTaskChange(index, 'taskId', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor={`taskName-${index}`} className="block text-sm font-medium text-gray-700 mb-2">
                      Task Name
                    </label>
                    <input
                      id={`taskName-${index}`}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      type="text"
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
                  <textarea
                    id={`description-${index}`}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={task.description}
                    onChange={(e) => handleTaskChange(index, 'description', e.target.value)}
                    rows="3"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <div>
                    <label htmlFor={`startDate-${index}`} className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date
                    </label>
                    <div className="relative">
                      <input
                        id={`startDate-${index}`}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pl-10"
                        type="date"
                        value={task.start_date}
                        onChange={(e) => handleTaskChange(index, 'start_date', e.target.value)}
                        required
                      />
                      <Calendar className="absolute left-3 top-3 text-gray-400" size={20} />
                    </div>
                  </div>
                  <div>
                    <label htmlFor={`dueDate-${index}`} className="block text-sm font-medium text-gray-700 mb-2">
                      Due Date
                    </label>
                    <div className="relative">
                      <input
                        id={`dueDate-${index}`}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pl-10"
                        type="date"
                        value={task.due_date}
                        onChange={(e) => handleTaskChange(index, 'due_date', e.target.value)}
                        required
                      />
                      <Calendar className="absolute left-3 top-3 text-gray-400" size={20} />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <div>
                    <label htmlFor={`consultant-${index}`} className="block text-sm font-medium text-gray-700 mb-2">
                      Assigned Consultant
                    </label>
                    <select name="consultantId">
        <option value="">Select Consultant</option>
        {users.consultants.map((consultant) => (
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
                    <input
                      id={`hours-${index}`}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      type="number"
                      value={task.hours}
                      onChange={(e) => handleTaskChange(index, 'hours', e.target.value)}
                      required
                    />
                  </div>
                </div>
                <button
                  type="button"
                  className="mt-2 p-3 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300 flex items-center"
                  onClick={() => removeTask(index)}
                >
                  <Minus size={20} className="mr-2" />
                  Remove Task
                </button>
              </div>
            ))}
            <button
              type="button"
              className="mb-6 p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300 flex items-center"
              onClick={addTask}
            >
              <Plus size={20} className="mr-2" />
              Add Task
            </button>
          </div>

          <div className="flex justify-between items-center">
            <button
              type="submit"
              className="px-8 py-4 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300 text-lg font-semibold"
            >
              Create Project
            </button>
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
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProject;