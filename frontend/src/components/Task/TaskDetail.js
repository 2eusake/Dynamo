import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const TaskDetail = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);

  const tasks = [
    { id: 3, name: 'Task 1 for Alpha', description: 'Description for Task 1', progress: 20 },
    { id: 4, name: 'Task 2 for Alpha', description: 'Description for Task 2', progress: 50 },
    { id: 5, name: 'Task 1 for Beta', description: 'Description for Task 1', progress: 60 },
    { id: 6, name: 'Task 2 for Beta', description: 'Description for Task 2', progress: 80 },
  ];

  useEffect(() => {
    const foundTask = tasks.find(task => task.id === parseInt(id, 10));
    if (foundTask) setTask(foundTask);
  }, [id]);

  return (
    <div>
      {task ? (
        <>
          <h2>Task Detail - {task.name}</h2>
          <p>Description: {task.description || 'No description available'}</p>
          <p>Progress: {task.progress || 0}%</p>
        </>
      ) : (
        <p>Loading task details...</p>
      )}
    </div>
  );
};

export default TaskDetail;
