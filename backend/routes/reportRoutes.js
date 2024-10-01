const express = require('express');
const router = express.Router();
const { getReports } = require('../controllers/reportController');

// Route to get reports data
router.get('/data', getReports);
module.exports = router;
