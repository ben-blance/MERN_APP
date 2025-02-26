// src/components/PieChart.jsx
import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { fetchPieChartData } from '../services/api';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

const PieChart = ({ selectedMonth }) => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadPieChartData = async () => {
      setLoading(true);
      setError(false);
      
      try {
        const data = await fetchPieChartData(selectedMonth);
        
        if (data && Array.isArray(data) && data.length > 0) {
          // Generate colors for each category
          const backgroundColors = data.map(() => 
            `hsl(${Math.random() * 360}, 70%, 60%)`
          );
          
          setChartData({
            labels: data.map(item => item.category),
            datasets: [
              {
                label: 'Items per Category',
                data: data.map(item => item.count),
                backgroundColor: backgroundColors,
                borderColor: backgroundColors.map(color => color.replace('0.8', '1')),
                borderWidth: 1,
              },
            ],
          });
        } else {
          // Handle empty data
          setChartData(null);
        }
      } catch (error) {
        console.error('Error loading pie chart data:', error);
        setError(true);
        setChartData(null);
      } finally {
        setLoading(false);
      }
    };

    loadPieChartData();
  }, [selectedMonth]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: `Category Distribution - ${selectedMonth.charAt(0).toUpperCase() + selectedMonth.slice(1)}`,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
  };

  if (loading) {
    return <div className="chart-container">
      <h2>Category Distribution</h2>
      <div className="loading">Loading category distribution chart...</div>
    </div>;
  }

  return (
    <div className="chart-container">
      <h2>Category Distribution</h2>
      {chartData ? (
        <div style={{ maxHeight: '400px' }}>
          <Pie data={chartData} options={options} />
        </div>
      ) : (
        <p className="no-data">{error ? "Error loading data" : `No category distribution data available for ${selectedMonth}`}</p>
      )}
    </div>
  );
};

export default PieChart;