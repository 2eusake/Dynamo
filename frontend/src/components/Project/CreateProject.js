import React, { useContext, useState } from 'react';
import { ProjectContext } from '../../contexts/ProjectContext';

const CreateProject = () => {
  const { addProject, consultants = [], updateTask } = useContext(ProjectContext);
  const [name, setName] = useState('Demo Project');
  const [description, setDescription] = useState('This is a demo project description.');
  const [startDate, setStartDate] = useState('2024-09-01');
  const [endDate, setEndDate] = useState('2024-12-01');
  const [budget, setBudget] = useState('10000');
  const [projectManager, setProjectManager] = useState('John Doe');
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

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const editTask = (task) => {
    setEditingTaskId(task.id);
    const updatedTasks = tasks.map(t =>
      t.id === task.id ? { ...t, name: task.name, dueDate: task.dueDate, assignedTo: task.assignedTo } : t
    );
    setTasks(updatedTasks);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate adding a project (since it's a demo)
    console.log({
      name,
      description,
      startDate,
      endDate,
      budget,
      projectManager,
      tasks,
      consultantIds: projectConsultants.map(c => c.id)
    });

    setName('Demo Project');
    setDescription('This is a demo project description.');
    setStartDate('2024-09-01');
    setEndDate('2024-12-01');
    setBudget('10000');
    setProjectManager('John Doe');
    setTasks([{ id: Date.now(), name: '', dueDate: '', assignedTo: '' }]);
    setProjectConsultants([]);
    setEditingTaskId(null);
  };

  // Mocked consultants data for demo purposes
  const demoConsultants = [
    { id: 1, username: 'Alice Consultant', role: 'consultant' },
    { id: 2, username: 'Bob Consultant', role: 'consultant' },
    ...consultants,
  ];

  const filteredConsultants = demoConsultants.filter(c => c.role === 'consultant');

  return (
    <div className="p-6 bg-deloitte-cyan min-h-screen">
      <h2 className="text-2xl font-semibold text-deloitte-blue mb-6">Create Project</h2>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
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
            setProjectConsultants(filteredConsultants.filter(c => selectedIds.includes(c.id.toString())));
          }}
          className="mb-4 p-2 border border-gray-300 rounded w-full"
        >
          {filteredConsultants.map((consultant) => (
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
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          placeholder="Project Budget"
          required
          className="mb-4 p-2 border border-gray-300 rounded w-full"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Project Description"
          required
          className="mb-4 p-2 border border-gray-300 rounded w-full"
        />
        <h3 className="text-xl font-semibold text-deloitte-blue mb-4">Tasks Allocation</h3>
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
              {filteredConsultants.map((consultant) => (
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
              Add Task
            </button>
            <button
              type="button"
              onClick={() => deleteTask(task.id)}
              className="mr-2 p-2 bg-red-600 text-white rounded"
            >
              Delete Task
            </button>
            <button
              type="button"
              onClick={() => editTask(task)}
              className="p-2 bg-deloitte-cyan text-white rounded"
            >
              Edit Task
            </button>
          </div>
        ))}
        <h3 className="text-xl font-semibold text-deloitte-blue mb-4">Allocated Tasks</h3>
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
                  {filteredConsultants.find(c => c.id === task.assignedTo)?.username || 'Unassigned'}
                </td>
                <td className="p-2">{task.dueDate}</td>
                <td className="p-2">
                  <button
                    type="button"
                    onClick={() => deleteTask(task.id)}
                    className="mr-2 p-2 bg-red-600 text-white rounded"
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    onClick={() => editTask(task)}
                    className="p-2 bg-deloitte-cyan text-white rounded"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          type="submit"
          className="p-2 bg-deloitte-blue text-white rounded w-full"
        >
          Save Project
        </button>
      </form>
    </div>
  );
};

export default CreateProject;
