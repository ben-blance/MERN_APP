// routes/barChart.js
const express = require('express');
const router = express.Router();
const { getBarChartData } = require('../controllers/analyticsController');

// @route   GET /api/bar-chart
// @desc    Get bar chart data
// @access  Public
router.get('/', getBarChartData);

module.exports = router;