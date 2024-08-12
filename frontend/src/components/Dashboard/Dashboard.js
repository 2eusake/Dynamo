import React, { useContext, useEffect } from 'react';
import ProjectCompletionChart from '../Project/ProjectCompletionChart';
import WeeklyPerformanceChart from '../Project/WeeklyPerformanceChart';
import { ProjectContext } from '../../contexts/ProjectContext';
import { TaskContext } from '../../contexts/TaskContext';
import { AuthContext } from '../../contexts/AuthContext';

const Dashboard = () => {
  const { fetchUserProjects } = useContext(ProjectContext);
  const { fetchUserTasks } = useContext(TaskContext);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchUserProjects();
    fetchUserTasks();
  }, [fetchUserProjects, fetchUserTasks]);

  // Static projects data for demo purposes
  const projects = [
    { id: 1, name: 'Project Alpha', progress: 85, dueDate: '2024-08-15' },
    { id: 2, name: 'Project Beta', progress: 60, dueDate: '2024-08-20' },
    { id: 3, name: 'Project Gamma', progress: 40, dueDate: '2024-08-30' },
  ];

  // Static tasks data for demo purposes
  const tasks = [
    { id: 1, name: 'Task 1 for Alpha', completed: false, dueDate: '2024-08-10', projectId: 1 },
    { id: 2, name: 'Task 2 for Beta', completed: false, dueDate: '2024-08-18', projectId: 2 },
    { id: 3, name: 'Task 3 for Gamma', completed: false, dueDate: '2024-08-28', projectId: 3 },
  ];

  // Static notifications for demo purposes
  const notifications = [
    'Project Alpha is 2 days past due!',
    'Task 2 for Beta is due in 5 days.',
    'Project Gamma is nearing its deadline with only 40% progress.',
  ];

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 p-4 overflow-auto">
        <h2 className="text-2xl font-bold text-deloitte-blue">
          Welcome back, {user?.name}!
        </h2>

        {/* Section for Projects Exceeding Allocated Time */}
        <section className="mt-6">
          <h3 className="text-xl font-semibold text-deloitte-black">
            Projects exceeding allocated time
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {projects.map(project => (
              <div key={project.id} className="border border-red-600 p-4 rounded-md shadow-md">
                <h4 className="text-lg font-semibold text-deloitte-black">
                  Title: {project.name}
                </h4>
                <p className="text-red-600">
                  Progress: {project.progress}% done, {project.dueDate} days past due date
                </p>
                <div className="progress-bar">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
                <p className="text-deloitte-black mt-2">Pending Tasks:</p>
                <ul className="list-disc pl-5 text-deloitte-black">
                  {tasks.filter(task => task.projectId === project.id && !task.completed).map(task => (
                    <li key={task.id}>{task.name}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Section for Current Projects */}
        <section className="mt-6">
          <h3 className="text-xl font-semibold text-deloitte-black">
            Current Projects
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
            {projects.map(project => (
              <div key={project.id} className="border border-gray-300 p-4 rounded-md shadow-md">
                <h4 className="text-lg font-semibold text-deloitte-black">
                  Title: {project.name}
                </h4>
                <p className="text-deloitte-black">Progress: {project.progress}%</p>
                <div className="progress-bar">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section for Notifications */}
        <section className="mt-6">
          <h3 className="text-xl font-semibold text-deloitte-black">
            Notifications
          </h3>
          <div className="border border-gray-300 p-4 rounded-md shadow-md h-64 overflow-auto">
            {notifications.length > 0 ? (
              <ul className="list-disc pl-5">
                {notifications.map((notification, index) => (
                  <li key={index} className="mb-2 text-deloitte-black">
                    {notification}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-deloitte-black">No notifications at this time.</p>
            )}
          </div>
        </section>

        {/* Section for Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <section>
            <h3 className="text-xl font-semibold text-deloitte-black">
              Allocated time VS actual time
            </h3>
            <div className="border border-gray-300 p-4 rounded-md shadow-md">
              <ProjectCompletionChart />
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-deloitte-black">
              Weekly performance
            </h3>
            <div className="border border-gray-300 p-4 rounded-md shadow-md">
              <WeeklyPerformanceChart />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
