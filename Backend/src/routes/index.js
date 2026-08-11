const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const crimeRoutes = require('./crime.routes');
const lgaRoutes = require('./lga.routes');
const alertRoutes = require('./alert.routes');
const dashboardRoutes = require('./dashboard.routes');

router.use('/auth', authRoutes);
router.use('/crimes', crimeRoutes);
router.use('/lgas', lgaRoutes);
router.use('/alerts', alertRoutes);
router.use('/dashboard', dashboardRoutes);

module.exports = router;