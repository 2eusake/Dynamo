const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

// Define the route for fetching reports data
router.get('/reports', reportController.getReports);

module.exports = router;
