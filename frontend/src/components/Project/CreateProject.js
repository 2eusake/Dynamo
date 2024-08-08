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
    <div>
      <h2>Create Project</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Project Title"
          required
        />
        <input
          type="text"
          value={projectManager}
          onChange={(e) => setProjectManager(e.target.value)}
          placeholder="Project Manager"
          required
        />
        <select
          multiple
          value={projectConsultants.map(c => c.id)}
          onChange={(e) => {
            const selectedIds = Array.from(e.target.selectedOptions, option => option.value);
            setProjectConsultants(consultants.filter(c => selectedIds.includes(c.id.toString())));
          }}
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
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          placeholder="Due Date"
          required
        />
        <input
          type="text"
          value={(new Date(endDate) - new Date(startDate)) / (1000 * 3600 * 24)}
          placeholder="Duration"
          readOnly
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Project Description"
          required
        />
        <h3>Tasks Allocation</h3>
        {tasks.map((task, index) => (
          <div key={task.id}>
            <input
              type="text"
              value={task.name}
              onChange={(e) => handleTaskChange(index, 'name', e.target.value)}
              placeholder="Task Description"
              required
            />
            <select
              value={task.assignedTo}
              onChange={(e) => handleTaskChange(index, 'assignedTo', e.target.value)}
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
            />
            <button type="button" onClick={addTask}>Add</button>
            <button type="button" onClick={() => deleteTask(task.id)}>Delete</button>
          </div>
        ))}
        <h3>Allocated Tasks</h3>
        <table>
          <thead>
            <tr>
              <th>Task</th>
              <th>Task Description</th>
              <th>Assigned to</th>
              <th>Due Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, index) => (
              <tr key={task.id}>
                <td>{index + 1}</td>
                <td>{task.name}</td>
                <td>{consultants.find(c => c.id === task.assignedTo)?.username || 'Unassigned'}</td>
                <td>{task.dueDate}</td>
                <td>
                  <button type="button" onClick={() => editTask(task.id)}>Edit</button>
                  <button type="button" onClick={() => deleteTask(task.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button type="button">Cancel</button>
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default CreateProject;
