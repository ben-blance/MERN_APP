// src/App.jsx
import React, { useState } from 'react';
import './App.css';
import MonthSelector from './components/MonthSelector';
import TransactionsTable from './components/TransactionsTable';
import Statistics from './components/Statistics';
import BarChart from './components/BarChart';
import PieChart from './components/PieChart';

const App = () => {
  const [selectedMonth, setSelectedMonth] = useState('march'); // Default to March

  const handleMonthChange = (month) => {
    setSelectedMonth(month);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Transaction Dashboard</h1>
        <MonthSelector 
          selectedMonth={selectedMonth}
          onChange={handleMonthChange}
        />
      </header>

      <main className="dashboard-content">
        <div className="stats-section">
          <Statistics selectedMonth={selectedMonth} />
        </div>

        <div className="charts-section">
          <div className="chart-wrapper">
            <BarChart selectedMonth={selectedMonth} />
          </div>
          <div className="chart-wrapper">
            <PieChart selectedMonth={selectedMonth} />
          </div>
        </div>

        <div className="table-section">
          <TransactionsTable selectedMonth={selectedMonth} />
        </div>
      </main>

      <footer className="app-footer">
        <p>© {new Date().getFullYear()} Transaction Analyzer</p>
      </footer>
    </div>
  );
};

export default App;