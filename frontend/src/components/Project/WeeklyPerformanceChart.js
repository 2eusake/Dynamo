import React, { useContext, useRef, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { ProjectContext } from '../../contexts/ProjectContext';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const WeeklyPerformanceChart = () => {
  const { projects } = useContext(ProjectContext);
  const chartRef = useRef(null);

  useEffect(() => {
    const chartInstance = chartRef.current;
    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, []);

  // Mock data for weekly performance
  const labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
  const data = {
    labels,
    datasets: [
      {
        label: 'Weekly Performance',
        data: [65, 59, 80, 81], // Replace with actual data
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  return (
    <div>
      <h2>Weekly Performance</h2>
      <Line ref={chartRef} data={data} />
    </div>
  );
};

export default WeeklyPerformanceChart;
