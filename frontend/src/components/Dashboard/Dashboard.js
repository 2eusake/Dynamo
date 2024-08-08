import React, { useContext, useEffect } from 'react';
import ProjectCompletionChart from '../Project/ProjectCompletionChart';
import WeeklyPerformanceChart from '../Project/WeeklyPerformanceChart';
import { ProjectContext } from '../../contexts/ProjectContext';
import { TaskContext } from '../../contexts/TaskContext';

const Dashboard = () => {
  const { fetchUserProjects, projects } = useContext(ProjectContext);
  const { fetchUserTasks, tasks } = useContext(TaskContext);

  useEffect(() => {
    fetchUserProjects();
    fetchUserTasks();
  }, [fetchUserProjects, fetchUserTasks]);

  // Filter projects exceeding allocated time
  const exceedingProjects = projects.filter(project => {
    // Logic to determine if a project is exceeding its allocated time
    return project.progress < 100 && new Date(project.dueDate) < new Date();
  });

  // Current projects
  const currentProjects = projects.filter(project => project.progress < 100);

  return (
    <div>
      <header>
        <nav>
          <a href="/">Deloitte</a>
          <a href="/add-project">Add Project</a>
          <a href="/projects">Projects</a>
          <a href="/reports">Reports</a>
          <button>Log Out</button>
        </nav>
      </header>
      <h2>Welcome back, Dany!</h2>
      
      <section>
        <h3>Projects exceeding allocated time</h3>
        <div>
          {exceedingProjects.map(project => (
            <div key={project.id}>
              <h4>Title: {project.name}</h4>
              <p>Progress: {project.progress}% done, {Math.abs(new Date() - new Date(project.dueDate)) / (1000 * 60 * 60 * 24)} days past due date</p>
              <p>Pending Tasks:</p>
              <ul>
                {tasks.filter(task => task.projectId === project.id && !task.completed).map(task => (
                  <li key={task.id}>{task.name}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
      
      <section>
        <h3>Current Projects</h3>
        <div>
          {currentProjects.map(project => (
            <div key={project.id}>
              <h4>Title: {project.name}</h4>
              <p>Progress: {project.progress}%</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3>Notifications</h3>
        <div>
          {/* Render notifications here */}
        </div>
      </section>
      
      <section>
        <h3>Allocated time VS actual time</h3>
        <ProjectCompletionChart />
      </section>
      
      <section>
        <h3>Weekly performance</h3>
        <WeeklyPerformanceChart />
      </section>
    </div>
  );
};

export default Dashboard;
