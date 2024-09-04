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

<<<<<<< HEAD
  const exceedingProjects = projects.filter(project => {
    return project.progress < 100 && new Date(project.dueDate) < new Date();
  });

  const currentProjects = projects.filter(project => project.progress < 100);

  const calculateDaysOverdue = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    const differenceInTime = now - due;
    return Math.ceil(differenceInTime / (1000 * 60 * 60 * 24));
  };
=======
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
>>>>>>> 6ff4711fd14c1449a2ad5b76ecb523b6786a0b62

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      {/* Main Content Area */}
      <div className="flex-1 p-6 overflow-auto bg-gray-50">
        <h2 className="text-3xl font-bold text-deloitte-blue mb-4">
          Welcome back, {user?.username}!
        </h2>

        {/* Section for Projects Exceeding Allocated Time */}
        <section className="mt-6">
          <h3 className="text-2xl font-semibold text-deloitte-black mb-4">
            Projects Exceeding Allocated Time
          </h3>
<<<<<<< HEAD
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {exceedingProjects.map(project => (
              <div key={project.id} className="border border-red-600 p-6 rounded-lg bg-red-50 shadow-md">
                <h4 className="text-lg font-semibold text-red-800 mb-2">
                  {project.name}
                </h4>
                <p className="text-red-600 mb-4">
                  {project.progress}% done, {calculateDaysOverdue(project.dueDate)} days past due date
                </p>
                <p className="font-semibold text-deloitte-black mb-2">Pending Tasks:</p>
                <ul className="list-disc pl-5 text-deloitte-black space-y-1">
=======
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
>>>>>>> 6ff4711fd14c1449a2ad5b76ecb523b6786a0b62
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
          <h3 className="text-2xl font-semibold text-deloitte-black mb-4">
            Current Projects
          </h3>
<<<<<<< HEAD
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {currentProjects.map(project => (
              <div key={project.id} className="border border-gray-300 p-6 rounded-lg bg-white shadow-md">
                <h4 className="text-lg font-semibold text-deloitte-black mb-2">
                  {project.name}
=======
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
            {projects.map(project => (
              <div key={project.id} className="border border-gray-300 p-4 rounded-md shadow-md">
                <h4 className="text-lg font-semibold text-deloitte-black">
                  Title: {project.name}
>>>>>>> 6ff4711fd14c1449a2ad5b76ecb523b6786a0b62
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

<<<<<<< HEAD
=======
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

>>>>>>> 6ff4711fd14c1449a2ad5b76ecb523b6786a0b62
        {/* Section for Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <section>
            <h3 className="text-2xl font-semibold text-deloitte-black mb-4">
              Allocated Time vs Actual Time
            </h3>
            <div className="border border-gray-300 p-6 rounded-lg bg-white shadow-md">
              <ProjectCompletionChart />
            </div>
          </section>

          <section>
            <h3 className="text-2xl font-semibold text-deloitte-black mb-4">
              Weekly Performance
            </h3>
            <div className="border border-gray-300 p-6 rounded-lg bg-white shadow-md">
              <WeeklyPerformanceChart />
            </div>
          </section>
        </div>
      </div>

      {/* Notification Bar */}
      <aside className="w-full lg:w-1/4 p-6 bg-white border-l border-gray-200 shadow-lg">
        <h3 className="text-2xl font-semibold text-deloitte-black mb-4">
          Notifications
        </h3>
        <div className="border border-gray-300 p-4 rounded-lg shadow-md h-64 overflow-y-auto bg-gray-50">
          {/* Render notifications here */}
        </div>
      </aside>
    </div>
  );
};

export default Dashboard;
