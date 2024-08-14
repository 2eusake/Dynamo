import React, { useContext } from 'react';
import { ProjectContext } from '../../contexts/ProjectContext';

const TaskList = () => {
  const { projects } = useContext(ProjectContext);
  const tasks = projects.flatMap(project => project.tasks);

  return (
    <div>
      <h3>Tasks</h3>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            {task.name} - {task.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
