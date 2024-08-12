import React, { useRef, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ProjectCompletionChart = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    const chartInstance = chartRef.current;
    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, []);

  const data = {
    labels: ['Project Alpha', 'Project Beta', 'Project Gamma', 'Project Delta'],
    datasets: [
      {
        label: 'Project Completion Progress',
        data: [30, 50, 75, 40],
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
