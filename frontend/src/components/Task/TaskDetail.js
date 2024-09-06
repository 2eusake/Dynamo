// src/components/Task/TaskDetail.js
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
