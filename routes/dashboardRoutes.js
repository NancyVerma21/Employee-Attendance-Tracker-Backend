const express = require('express');
const router = express.Router();

// Import the dashboard controller function
const { getDashboardStats } = require('../controllers/dashboardController');

// Define the route for dashboard stats
router.get('/stats', getDashboardStats);

module.exports = router;
