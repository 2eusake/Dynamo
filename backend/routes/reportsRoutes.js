const express = require('express');
const router = express.Router();
const { getReportsData } = require('../controllers/reportController');

// Route to get reports data
router.get('/data', getReportsData);
module.exports = router;
