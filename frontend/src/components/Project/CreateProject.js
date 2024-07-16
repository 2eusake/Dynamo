import React, { useState, useContext } from 'react';
import { ProjectContext } from '../../contexts/ProjectContext';

const CreateProject = () => {
  const { addProject } = useContext(ProjectContext);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    addProject({ name, description });
    setName('');
    setDescription('');
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
        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default CreateProject;
