import React from 'react';

const TaskList = () => {
  // Dummy data for tasks
  const tasks = [
    { id: 1, name: 'Task 1', status: 'Pending' },
    { id: 2, name: 'Task 2', status: 'Completed' },
  ];

  return (
    <div>
      <h3>Tasks</h3>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            {task.name} - {task.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
