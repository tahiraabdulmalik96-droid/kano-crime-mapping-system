const express = require('express');
const router = express.Router();
const {
  getAllLGAs,
  getLGAById,
  createLGA,
  updateSafetyScore
} = require('../controllers/lgaController');

// Get all LGAs
router.get('/', getAllLGAs);

// Get single LGA
router.get('/:id', getLGAById);

// Create LGA
router.post('/', createLGA);

// Update safety score
router.put('/:id/safety-score', updateSafetyScore);

module.exports = router;