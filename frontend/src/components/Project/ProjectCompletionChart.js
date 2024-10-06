import React, { useContext, useRef, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { ProjectContext } from '../../contexts/ProjectContext';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ProjectCompletionChart = () => {
  const { latestProject } = useContext(ProjectContext);
  const chartRef = useRef(null);

  useEffect(() => {
    const chartInstance = chartRef.current;
    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, []);

  if (!latestProject) {
    return <div>Loading...</div>;
  }

  const data = {
    labels: [latestProject.name],
    datasets: [
      {
        label: 'Project Completion Progress',
        data: [latestProject.progress],
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

export default ProjectCompletionChart;
