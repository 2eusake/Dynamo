<<<<<<< HEAD
import React, { useContext, useEffect, useState } from 'react';
=======
import React, { useState, useEffect } from 'react';
>>>>>>> 6ff4711fd14c1449a2ad5b76ecb523b6786a0b62
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
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-md">
      {task ? (
        <>
          <h2 className="text-4xl font-bold mb-4 text-deloitte-blue">Task: {task.name}</h2>
          <p className="text-xl text-deloitte-black mb-6">
            {task.description || 'No description available'}
          </p>
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xl font-semibold text-deloitte-black">Progress</span>
              <span className="text-xl font-semibold text-deloitte-black">{task.progress || 0}%</span>
            </div>
            <div className="w-full bg-gray-300 rounded-full h-4">
              <div
                className="bg-deloitte-green h-4 rounded-full"
                style={{ width: `${task.progress || 0}%` }}
              ></div>
            </div>
          </div>
        </>
      ) : (
        <p className="text-deloitte-black">Loading task details...</p>
      )}
    </div>
  );
};

export default TaskDetail;
