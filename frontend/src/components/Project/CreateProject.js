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
  const [tasks, setTasks] = useState([{ name: '', dueDate: '', assignedTo: '' }]);

  const handleTaskChange = (index, key, value) => {
    const newTasks = [...tasks];
    newTasks[index][key] = value;
    setTasks(newTasks);
  };

  const addTask = () => {
    setTasks([...tasks, { name: '', dueDate: '', assignedTo: '' }]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addProject({ name, description, startDate, endDate, budget, projectManager, tasks });
    setName('');
    setDescription('');
    setStartDate('');
    setEndDate('');
    setBudget('');
    setProjectManager('');
    setTasks([{ name: '', dueDate: '', assignedTo: '' }]);
  };

  return (
    <div>
      <h2>Create Project</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Project Name"
          required
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Project Description"
          required
        />
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
          placeholder="End Date"
          required
        />
        <input
          type="number"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          placeholder="Budget"
          required
        />
        <input
          type="text"
          value={projectManager}
          onChange={(e) => setProjectManager(e.target.value)}
          placeholder="Project Manager"
          required
        />
        <div>
          <h3>Tasks</h3>
          {tasks.map((task, index) => (
            <div key={index}>
              <input
                type="text"
                value={task.name}
                onChange={(e) => handleTaskChange(index, 'name', e.target.value)}
                placeholder="Task Name"
                required
              />
              <input
                type="date"
                value={task.dueDate}
                onChange={(e) => handleTaskChange(index, 'dueDate', e.target.value)}
                placeholder="Due Date"
                required
              />
              <select
                value={task.assignedTo}
                onChange={(e) => handleTaskChange(index, 'assignedTo', e.target.value)}
              >
                <option value="">Assign to</option>
                {consultants.map(consultant => (
                  <option key={consultant.id} value={consultant.id}>{consultant.username}</option>
                ))}
              </select>
            </div>
          ))}
          <button type="button" onClick={addTask}>Add Task</button>
        </div>
        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default CreateProject;
