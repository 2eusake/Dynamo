import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import apiClient from '../../utils/apiClient';
import { Plus, Minus, Upload, Calendar } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import './CreateProject.css';
const CreateProject = () => {
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    projectManagerId: '',
    directorId: '',
    duration: '',
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
        const { consultants, projectManagers, directors } = response.data;
        setUsers({ consultants, projectManagers, directors });
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

    const validTasks = formData.tasks.filter(task => task.taskName && task.taskName.trim() !== '');

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
        duration: '',
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
    <div className={`create-project-page ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="create-project-container">
        <h2>Create New Project</h2>
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

          <div className="input-grid">
            <div>
              <label htmlFor="projectManagerId">Project Manager</label>
              <select
                name="projectManagerId"
                value={formData.projectManagerId}
                onChange={handleInputChange}
                required
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
              <label htmlFor="directorId">Director</label>
              <select
                name="directorId"
                value={formData.directorId}
                onChange={handleInputChange}
                required
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

          <div className="input-grid">
            <div>
              <label htmlFor="startDate">Start Date</label>
              <input
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
              <input
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
              <input
                id="duration"
                type="number"
                value={projectDurationWeeks}
                readOnly
              />
            </div>
          </div>

          <div className="task-section">
            
            {formData.tasks.map((task, index) => (
              <div key={index} className="task-card">
                <div className="input-grid">
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
                >
                  <Minus size={20} /> Remove Task
                </button>
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
  );
};

export default CreateProject;
