import React from 'react';
import { useParams } from 'react-router-dom';

const TaskDetail = () => {
  const { id } = useParams();
  // Dummy data for task details
  const task = { id, name: 'Task 1', description: 'Task details...', status: 'Pending' };

  return (
    <div>
      <h2>Task Detail - {id}</h2>
      <p>Name: {task.name}</p>
      <p>Description: {task.description}</p>
      <p>Status: {task.status}</p>
    </div>
  );
};

export default TaskDetail;
