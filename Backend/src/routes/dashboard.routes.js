const express = require('express');
const router = express.Router();
const { getWeeklyStats } = require('../controllers/dashboardController');

router.get('/weekly', getWeeklyStats);

module.exports = router;