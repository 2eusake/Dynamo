import React, { useContext, useRef, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { ProjectContext } from '../../contexts/ProjectContext'; // Correct path

// Register the necessary components with Chart.js
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ProjectCompletionChart = () => {
  const { projects } = useContext(ProjectContext);
  const chartRef = useRef(null);

  useEffect(() => {
    const chartInstance = chartRef.current;

    // Cleanup on unmount
    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, []);

  // Add a check to ensure projects is defined
  if (!projects) {
    return <div>Loading...</div>;
  }

  const projectLabels = projects.map(project => `Project ${project.id}`);
  const projectProgress = projects.map(project => project.progress);

  const data = {
    labels: projectLabels,
    datasets: [
      {
        label: 'Project Completion Progress',
        data: projectProgress,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  return (
    <div>
      <h2>Project Completion Progress</h2>
      <Line ref={chartRef} data={data} />
    </div>
  );
};

export default ProjectProvider;
