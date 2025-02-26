// routes/statistics.js
const express = require('express');
const router = express.Router();
const { getStatistics } = require('../controllers/analyticsController');

// @route   GET /api/statistics
// @desc    Get statistics for a month
// @access  Public
router.get('/', getStatistics);

module.exports = router;