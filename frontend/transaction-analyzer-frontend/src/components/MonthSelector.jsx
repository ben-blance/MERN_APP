// src/components/MonthSelector.jsx
import React from 'react';

const MonthSelector = ({ selectedMonth, onChange }) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="month-selector">
      <label htmlFor="month-select">Select Month: </label>
      <select 
        id="month-select" 
        value={selectedMonth} 
        onChange={(e) => onChange(e.target.value)}
        className="select-month"
      >
        {months.map((month) => (
          <option key={month} value={month.toLowerCase()}>
            {month}
          </option>
        ))}
      </select>
    </div>
  );
};

export default MonthSelector;