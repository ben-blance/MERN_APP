// controllers/dataInitializer.js
const axios = require('axios');
const Transaction = require('../models/Transaction');

const initializeDatabase = async () => {
  try {
    // Check if data already exists
    const count = await Transaction.countDocuments();
    
    if (count > 0) {
      console.log('Database already populated with transaction data');
      return;
    }
    
    // Fetch data from the provided URL
    console.log('Fetching transaction data...');
    const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    const transactions = response.data;
    
    if (!transactions || !Array.isArray(transactions)) {
      throw new Error('Invalid data format received');
    }
    
    // Process and format the data
    const formattedTransactions = transactions.map(transaction => {
      // Ensure dateOfSale is a proper Date object
      return {
        ...transaction,
        dateOfSale: new Date(transaction.dateOfSale)
      };
    });
    
    // Insert all transactions into the database
    console.log(`Inserting ${formattedTransactions.length} transactions into the database...`);
    await Transaction.insertMany(formattedTransactions);
    
    console.log('Database successfully initialized with transaction data');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

module.exports = { initializeDatabase };