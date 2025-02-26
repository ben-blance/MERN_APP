// src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json'
  }
});

// Helper function to handle API errors
const handleApiError = (error, fallbackMessage) => {
  console.error(fallbackMessage, error);
  
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.error('Response data:', error.response.data);
    console.error('Response status:', error.response.status);
    throw new Error(error.response.data.message || fallbackMessage);
  } else if (error.request) {
    // The request was made but no response was received
    console.error('No response received:', error.request);
    throw new Error('No response from server. Please check your connection.');
  } else {
    // Something happened in setting up the request that triggered an Error
    throw new Error(error.message || fallbackMessage);
  }
};

export const fetchTransactions = async (month, search = '', page = 1, perPage = 10) => {
  try {
    const response = await apiClient.get('/transactions', {
      params: { month, search, page, perPage }
    });
    return response.data;
  } catch (error) {
    return handleApiError(error, 'Error fetching transactions');
  }
};

export const fetchStatistics = async (month) => {
  try {
    const response = await apiClient.get('/statistics', {
      params: { month }
    });
    
    // Check for empty response
    if (!response.data || Object.keys(response.data).length === 0) {
      console.warn('Empty statistics response');
      return {
        totalSaleAmount: 0,
        totalSoldItems: 0,
        totalUnsoldItems: 0
      };
    }
    
    return response.data;
  } catch (error) {
    console.error('Error fetching statistics:', error);
    // Return default values instead of throwing an error
    return {
      totalSaleAmount: 0,
      totalSoldItems: 0,
      totalUnsoldItems: 0
    };
  }
};

export const fetchBarChartData = async (month) => {
  try {
    const response = await apiClient.get('/bar-chart', {
      params: { month }
    });
    return response.data;
  } catch (error) {
    return handleApiError(error, 'Error fetching bar chart data');
  }
};

export const fetchPieChartData = async (month) => {
  try {
    const response = await apiClient.get('/pie-chart', {
      params: { month }
    });
    return response.data;
  } catch (error) {
    return handleApiError(error, 'Error fetching pie chart data');
  }
};

export const fetchSummary = async (month) => {
  try {
    const response = await apiClient.get('/summary', {
      params: { month }
    });
    return response.data;
  } catch (error) {
    return handleApiError(error, 'Error fetching summary data');
  }
};