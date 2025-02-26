// routes/summary.js
const express = require('express');
const router = express.Router();
const { getSummary } = require('../controllers/analyticsController');

// @route   GET /api/summary
// @desc    Get combined data from all endpoints
// @access  Public
router.get('/', getSummary);

module.exports = router;