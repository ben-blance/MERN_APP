// src/components/BarChart.jsx
import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { fetchBarChartData } from '../services/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = ({ selectedMonth }) => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadBarChartData = async () => {
      setLoading(true);
      setError(false);
      
      try {
        const data = await fetchBarChartData(selectedMonth);
        
        if (data && Array.isArray(data) && data.length > 0) {
          // Prepare data for Chart.js
          const labels = data.map(item => `$${item.range}`);
          const counts = data.map(item => item.count);
          
          setChartData({
            labels,
            datasets: [
              {
                label: 'Number of Items',
                data: counts,
                backgroundColor: 'rgba(54, 162, 235, 0.8)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
              },
            ],
          });
        } else {
          // Handle empty data
          setChartData(null);
          setError(true);
        }
      } catch (error) {
        console.error('Error loading bar chart data:', error);
        setError(true);
        setChartData(null);
      } finally {
        setLoading(false);
      }
    };

    loadBarChartData();
  }, [selectedMonth]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Price Range Distribution - ${selectedMonth.charAt(0).toUpperCase() + selectedMonth.slice(1)}`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Items',
        },
        ticks: {
          precision: 0,
        },
      },
      x: {
        title: {
          display: true,
          text: 'Price Range',
        },
      },
    },
  };

  if (loading) {
    return <div className="chart-container">
      <h2>Price Range Distribution</h2>
      <div className="loading">Loading price distribution chart...</div>
    </div>;
  }

  return (
    <div className="chart-container">
      <h2>Price Range Distribution</h2>
      {chartData ? (
        <Bar data={chartData} options={options} />
      ) : (
        <p className="no-data">{error ? "Error loading data" : `No price distribution data available for ${selectedMonth}`}</p>
      )}
    </div>
  );
};

export default BarChart;