const express = require('express');
const router = express.Router();
const {
  getAllCrimes,
  getCrimeById,
  createCrime,
  updateCrimeStatus,
  deleteCrime
} = require('../controllers/crimeController');

// Get all crimes
router.get('/', getAllCrimes);

// Get single crime
router.get('/:id', getCrimeById);

// Create crime
router.post('/', createCrime);

// Update crime status
router.put('/:id/status', updateCrimeStatus);

// Delete crime
router.delete('/:id', deleteCrime);

module.exports = router;