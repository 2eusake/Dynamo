import React, { useState, useEffect } from "react";
import axios from 'axios';
import ProjectCompletionChart from "../Project/ProjectCompletionChart";
import WeeklyPerformanceChart from "../Project/WeeklyPerformanceChart";

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        const [projectsResponse, tasksResponse, userResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/projects', {
            headers: { 'Authorization': `Bearer ${token}` },
          }),
          axios.get('http://localhost:5000/api/tasks', {
            headers: { 'Authorization': `Bearer ${token}` },
          }),
          axios.get('http://localhost:5000/api/users/profile', {
            headers: { 'Authorization': `Bearer ${token}` },
          })
        ]);

        setProjects(projectsResponse.data);
        setTasks(tasksResponse.data);
        setUser(userResponse.data);
      } catch (err) {
        setError('Failed to fetch data. Please try again later.');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate projects that are exceeding their allocated time
  const exceedingProjects = projects.filter((project) => {
    return project.progress < 100 && new Date(project.endDate) < new Date();
  });

  // Calculate current ongoing projects
  const currentProjects = projects.filter((project) => project.progress < 100);

  // Helper function to calculate the difference in days
  const calculateDaysOverdue = (endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    const differenceInTime = now - end;
    return Math.ceil(differenceInTime / (1000 * 60 * 60 * 24));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 p-4 overflow-auto">
        <h2 className="text-2xl font-bold text-deloitte-blue">
          Welcome back, {user?.username}!
        </h2>

        {/* Section for Projects Exceeding Allocated Time */}
        <section className="mt-6">
          <h3 className="text-xl font-semibold text-deloitte-black">
            Projects exceeding allocated time
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {exceedingProjects.map((project) => (
              <div
                key={project.id}
                className="border border-red-600 p-4 rounded-md shadow-md"
              >
                <h4 className="text-lg font-semibold text-deloitte-black">
                  Title: {project.name}
                </h4>
                <p className="text-red-600">
                  Progress: {project.progress}% done,
                  {calculateDaysOverdue(project.endDate)} days past due date
                </p>
                <p className="text-deloitte-black mt-2">Pending Tasks:</p>
                <ul className="list-disc pl-5 text-deloitte-black">
                  {tasks
                    .filter(
                      (task) => task.project_id === project.id && task.status !== 'completed'
                    )
                    .map((task) => (
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
            {currentProjects.map((project) => (
              <div
                key={project.id}
                className="border border-gray-300 p-4 rounded-md shadow-md"
              >
                <h4 className="text-lg font-semibold text-deloitte-black">
                  Title: {project.name}
                </h4>
                <p className="text-deloitte-black">
                  Progress: {project.progress}%
                </p>
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
            {/* Render notifications here */}
          </div>
        </section>

        {/* Section for Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <section>
            <h3 className="text-xl font-semibold text-deloitte-black">
              Allocated time VS actual time
            </h3>
            <div className="border border-gray-300 p-4 rounded-md shadow-md">
              <ProjectCompletionChart projects={projects} />
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-deloitte-black">
              Weekly performance
            </h3>
            <div className="border border-gray-300 p-4 rounded-md shadow-md">
              <WeeklyPerformanceChart tasks={tasks} />
            </div>
          </section>
        </div>
      </div>

      {/* Notification Bar */}
      <aside className="w-full lg:w-1/4 p-4">
        <h3 className="text-xl font-semibold text-deloitte-black">
          Notifications
        </h3>
        <div className="border border-gray-300 p-4 rounded-md shadow-md h-64 overflow-auto">
          {/* Render notifications here */}
        </div>
      </aside>
    </div>
  );
};

export default Dashboard;
