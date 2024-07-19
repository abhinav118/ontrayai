import React from 'react';
import { Pie } from 'react-chartjs-2';

function PieChart({ data }) {
  const chartData = {
    labels: ['Protein', 'Carbs', 'Fat'],
    datasets: [{
      data: [data.protein, data.carbs, data.fat],
      backgroundColor: ['#00ff00', '#ffff00', '#ff0000']
    }]
  };

  return <Pie data={chartData} />;
}

export default PieChart;
