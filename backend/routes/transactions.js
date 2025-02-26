// routes/transactions.js
const express = require('express');
const router = express.Router();
const { getTransactions } = require('../controllers/transactionController');

// @route   GET /api/transactions
// @desc    Get transactions with search and pagination
// @access  Public
router.get('/', getTransactions);

module.exports = router;