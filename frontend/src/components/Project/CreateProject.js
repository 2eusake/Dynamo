import React, { useState, useContext } from 'react';
import { ProjectContext } from '../../contexts/ProjectContext';

const CreateProject = () => {
  const { addProject, consultants } = useContext(ProjectContext);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState('');
  const [projectManager, setProjectManager] = useState('');
  const [projectConsultants, setProjectConsultants] = useState([]);
  const [tasks, setTasks] = useState([{ id: Date.now(), name: '', dueDate: '', assignedTo: '' }]);
  const [editingTaskId, setEditingTaskId] = useState(null);

  const handleTaskChange = (index, key, value) => {
    const newTasks = [...tasks];
    newTasks[index][key] = value;
    setTasks(newTasks);
  };

  const addTask = () => {
    setTasks([...tasks, { id: Date.now(), name: '', dueDate: '', assignedTo: '' }]);
  };

  const editTask = (id) => {
    setEditingTaskId(id);
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addProject({
      name,
      description,
      startDate,
      endDate,
      budget,
      projectManager,
      tasks,
      consultantIds: projectConsultants.map(c => c.id)
    });
    setName('');
    setDescription('');
    setStartDate('');
    setEndDate('');
    setBudget('');
    setProjectManager('');
    setTasks([{ id: Date.now(), name: '', dueDate: '', assignedTo: '' }]);
    setProjectConsultants([]);
  };

  return (
    <div className="p-6 bg-deloitte-cyan min-h-screen"> {/* Background Color */}
      <h2 className="text-2xl font-semibold text-deloitte-blue mb-6">Create Project</h2> {/* Title Styling */}
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6"> {/* Form Container */}
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Project Title"
          required
          className="mb-4 p-2 border border-gray-300 rounded w-full"
        />
        <input
          type="text"
          value={projectManager}
          onChange={(e) => setProjectManager(e.target.value)}
          placeholder="Project Manager"
          required
          className="mb-4 p-2 border border-gray-300 rounded w-full"
        />
        <select
          multiple
          value={projectConsultants.map(c => c.id)}
          onChange={(e) => {
            const selectedIds = Array.from(e.target.selectedOptions, option => option.value);
            setProjectConsultants(consultants.filter(c => selectedIds.includes(c.id.toString())));
          }}
          className="mb-4 p-2 border border-gray-300 rounded w-full"
        >
          {consultants.map((consultant) => (
            <option key={consultant.id} value={consultant.id}>
              {consultant.username}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          placeholder="Start Date"
          required
          className="mb-4 p-2 border border-gray-300 rounded w-full"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          placeholder="Due Date"
          required
          className="mb-4 p-2 border border-gray-300 rounded w-full"
        />
        <input
          type="text"
          value={(new Date(endDate) - new Date(startDate)) / (1000 * 3600 * 24)}
          placeholder="Duration"
          readOnly
          className="mb-4 p-2 border border-gray-300 rounded w-full bg-gray-100"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Project Description"
          required
          className="mb-4 p-2 border border-gray-300 rounded w-full"
        />
        <h3 className="text-xl font-semibold text-deloitte-blue mb-4">Tasks Allocation</h3> {/* Subheading */}
        {tasks.map((task, index) => (
          <div key={task.id} className="mb-4">
            <input
              type="text"
              value={task.name}
              onChange={(e) => handleTaskChange(index, 'name', e.target.value)}
              placeholder="Task Description"
              required
              className="mb-2 p-2 border border-gray-300 rounded w-full"
            />
            <select
              value={task.assignedTo}
              onChange={(e) => handleTaskChange(index, 'assignedTo', e.target.value)}
              className="mb-2 p-2 border border-gray-300 rounded w-full"
            >
              <option value="">Assign to:</option>
              {consultants.map((consultant) => (
                <option key={consultant.id} value={consultant.id}>
                  {consultant.username}
                </option>
              ))}
            </select>
            <input
              type="date"
              value={task.dueDate}
              onChange={(e) => handleTaskChange(index, 'dueDate', e.target.value)}
              placeholder="Due Date"
              required
              className="mb-2 p-2 border border-gray-300 rounded w-full"
            />
            <button
              type="button"
              onClick={addTask}
              className="mr-2 p-2 bg-deloitte-green text-white rounded"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => deleteTask(task.id)}
              className="p-2 bg-red-600 text-white rounded"
            >
              Delete
            </button>
          </div>
        ))}
        <h3 className="text-xl font-semibold text-deloitte-blue mb-4">Allocated Tasks</h3> {/* Subheading */}
        <table className="w-full mb-4">
          <thead>
            <tr className="bg-deloitte-blue text-white">
              <th className="p-2">Task</th>
              <th className="p-2">Task Description</th>
              <th className="p-2">Assigned to</th>
              <th className="p-2">Due Date</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, index) => (
              <tr key={task.id} className="border-b">
                <td className="p-2">{index + 1}</td>
                <td className="p-2">{task.name}</td>
                <td className="p-2">
                  {consultants.find(c => c.id === task.assignedTo)?.username || 'Unassigned'}
                </td>
                <td className="p-2">{task.dueDate}</td>
                <td className="p-2">
                  <button
                    type="button"
                    onClick={() => editTask(task.id)}
                    className="mr-2 p-2 bg-deloitte-cyan text-white rounded"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteTask(task.id)}
                    className="p-2 bg-red-600 text-white rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-end">
          <button
            type="button"
            className="mr-2 p-2 bg-gray-300 text-black rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="p-2 bg-deloitte-blue text-white rounded"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProject;
