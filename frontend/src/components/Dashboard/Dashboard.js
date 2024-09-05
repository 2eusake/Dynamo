import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProjectCompletionChart from '../Project/ProjectCompletionChart';
import WeeklyPerformanceChart from '../Project/WeeklyPerformanceChart';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        console.log(token)
        const headers = { Authorization: `Bearer ${token}` };

        const [projectsResponse, tasksResponse, userResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/projects/user', { headers }),
          axios.get('http://localhost:5000/api/tasks/user', { headers }),
          axios.get('http://localhost:5000/api/users/profile', { headers })
        ]);

        setProjects(projectsResponse.data);
        setTasks(tasksResponse.data);
        setUser(userResponse.data);
        setIsLoading(false);
        toast.success('Dashboard data loaded successfully!');
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data.');
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

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

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      {/* Main Content Area */}
      <div className="flex-1 p-6 overflow-auto bg-gray-50">
        <h2 className="text-3xl font-bold text-deloitte-blue mb-4">
          Welcome back, {user?.username || 'User'}!
        </h2>

        {/* Section for Projects Exceeding Allocated Time */}
        {exceedingProjects.length > 0 && (
          <section className="mt-6">
            <h3 className="text-2xl font-semibold text-deloitte-black mb-4">
              Projects Exceeding Allocated Time
            </h3>
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
                    {tasks.filter(task => task.projectId === project.id && !task.completed).map(task => (
                      <li key={task.id}>{task.name}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section for Current Projects */}
        {currentProjects.length > 0 && (
          <section className="mt-6">
            <h3 className="text-2xl font-semibold text-deloitte-black mb-4">
              Current Projects
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {currentProjects.map(project => (
                <div key={project.id} className="border border-gray-300 p-6 rounded-lg bg-white shadow-md">
                  <h4 className="text-lg font-semibold text-deloitte-black mb-2">
                    {project.name}
                  </h4>
                  <p className="text-deloitte-black">Progress: {project.progress}%</p>
                </div>
              ))}
            </div>
          </section>
        )}

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
      <ToastContainer />
    </div>
  );
};

export default Dashboard;