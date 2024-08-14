import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ProjectContext } from '../../contexts/ProjectContext';

const TaskDetail = () => {
  const { id } = useParams();
  const { projects } = useContext(ProjectContext);
  const [task, setTask] = useState(null);

  useEffect(() => {
    if (!projects) return;

    projects.forEach(project => {
      const foundTask = project.tasks.find(task => task.id === parseInt(id, 10));
      if (foundTask) setTask(foundTask);
    });
  }, [id, projects]);

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
