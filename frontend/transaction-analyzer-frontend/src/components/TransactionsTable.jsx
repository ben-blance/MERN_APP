// src/components/TransactionsTable.jsx
import React, { useState, useEffect } from 'react';
import { fetchTransactions } from '../services/api';

const TransactionsTable = ({ selectedMonth }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage] = useState(10);

  useEffect(() => {
    const loadTransactions = async () => {
      setLoading(true);
      setError(false);
      
      try {
        const data = await fetchTransactions(selectedMonth, search, page, perPage);
        
        if (data && data.transactions) {
          setTransactions(data.transactions);
          setTotalPages(Math.ceil((data.total || 0) / perPage));
        } else {
          setTransactions([]);
          setTotalPages(1);
        }
      } catch (error) {
        console.error('Error loading transactions:', error);
        setError(true);
        setTransactions([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, [selectedMonth, search, page, perPage]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1); // Reset to first page when search changes
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="transactions-container">
      <h2>Transactions - {selectedMonth.charAt(0).toUpperCase() + selectedMonth.slice(1)}</h2>
      
      <div className="search-box">
        <input
          type="text"
          placeholder="Search by title, description or price..."
          value={search}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>
      
      <div className="table-container">
        {loading ? (
          <div className="loading">Loading transactions...</div>
        ) : error ? (
          <div className="error">Error loading transactions. Please try again later.</div>
        ) : (
          <table className="transactions-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Description</th>
                <th>Price</th>
                <th>Category</th>
                <th>Sold</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length > 0 ? (
                transactions.map((transaction) => (
                  <tr key={transaction._id}>
                    <td>{transaction._id}</td>
                    <td>{transaction.title}</td>
                    <td>{transaction.description}</td>
                    <td>${(transaction.price || 0).toFixed(2)}</td>
                    <td>{transaction.category}</td>
                    <td>{transaction.sold ? 'Yes' : 'No'}</td>
                    <td>{transaction.dateOfSale ? new Date(transaction.dateOfSale).toLocaleDateString() : 'N/A'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="no-data">No transactions found</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
      
      {!loading && !error && (
        <div className="pagination">
          <button 
            onClick={() => handlePageChange(page - 1)} 
            disabled={page === 1}
            className="pagination-btn"
          >
            Previous
          </button>
          <span className="page-info">Page {page} of {totalPages}</span>
          <button 
            onClick={() => handlePageChange(page + 1)} 
            disabled={page === totalPages || totalPages === 0}
            className="pagination-btn"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default TransactionsTable;