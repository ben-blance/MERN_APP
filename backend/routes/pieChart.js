// routes/pieChart.js
const express = require('express');
const router = express.Router();
const { getPieChartData } = require('../controllers/analyticsController');

// @route   GET /api/pie-chart
// @desc    Get pie chart data
// @access  Public
router.get('/', getPieChartData);

module.exports = router;