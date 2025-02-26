// models/Transaction.js
const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true,
    index: true // Adding index for search optimization
  },
  price: {
    type: Number,
    required: true,
    index: true // Adding index for search and range queries
  },
  description: {
    type: String,
    required: true,
    index: true // Adding index for search optimization
  },
  category: {
    type: String,
    required: true,
    index: true // Adding index for category aggregation
  },
  image: {
    type: String
  },
  sold: {
    type: Boolean,
    default: false,
    index: true // Adding index for sold/unsold queries
  },
  dateOfSale: {
    type: Date,
    required: true,
    index: true // Adding index for date-based queries
  }
}, {
  timestamps: true
});

// Adding a compound index for the most common search operations
TransactionSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Transaction', TransactionSchema);