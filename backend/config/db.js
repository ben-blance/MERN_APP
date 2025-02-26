// config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Use a fallback connection string if MONGO_URI is not defined
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/transaction-analyzer';
    console.log('Connecting to MongoDB with URI:', uri);
    
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;