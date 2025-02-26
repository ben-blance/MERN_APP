// src/components/Statistics.jsx
import React, { useState, useEffect } from 'react';
import { fetchTransactions } from '../services/api';

// Helper to compute statistics from transactions
const computeStatistics = (transactions) => {
  return transactions.reduce((acc, tx) => {
    if (tx.sold) {
      acc.totalSaleAmount += tx.price || 0;
      acc.totalSoldItems += 1;
    } else {
      acc.totalUnsoldItems += 1;
    }
    return acc;
  }, { totalSaleAmount: 0, totalSoldItems: 0, totalUnsoldItems: 0 });
};

const Statistics = ({ selectedMonth }) => {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadStatistics = async () => {
      setLoading(true);
      setError(false);
      try {
        // Fetch all transactions by using a high perPage value
        const data = await fetchTransactions(selectedMonth, '', 1, 10000);
        if (data && data.transactions) {
          const stats = computeStatistics(data.transactions);
          setStatistics(stats);
        } else {
          setStatistics({
            totalSaleAmount: 0,
            totalSoldItems: 0,
            totalUnsoldItems: 0
          });
          setError(true);
        }
      } catch (err) {
        console.error('Error computing statistics from transactions:', err);
        setStatistics({
          totalSaleAmount: 0,
          totalSoldItems: 0,
          totalUnsoldItems: 0
        });
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadStatistics();
  }, [selectedMonth]);

  if (loading) {
    return (
      <div className="statistics-container">
        <h2>Statistics - {selectedMonth}</h2>
        <div className="loading">Loading statistics...</div>
      </div>
    );
  }

  return (
    <div className="statistics-container">
      <h2>Statistics - {selectedMonth}</h2>
      {statistics && !error ? (
        <div className="stats-grid">
          <div className="stat-box">
            <h3>Total Sales</h3>
            <p className="stat-value">
              ${(statistics.totalSaleAmount || 0).toFixed(2)}
            </p>
          </div>
          <div className="stat-box">
            <h3>Sold Items</h3>
            <p className="stat-value">{statistics.totalSoldItems || 0}</p>
          </div>
          <div className="stat-box">
            <h3>Unsold Items</h3>
            <p className="stat-value">{statistics.totalUnsoldItems || 0}</p>
          </div>
        </div>
      ) : (
        <p className="error">
          {error
            ? "Error loading statistics"
            : `No statistics available for ${selectedMonth}`}
        </p>
      )}
    </div>
  );
};

export default Statistics;
