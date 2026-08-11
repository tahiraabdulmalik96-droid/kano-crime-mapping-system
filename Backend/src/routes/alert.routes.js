const express = require('express');
const router = express.Router();
const {
  getAllAlerts,
  createAlert,
  deactivateAlert
} = require('../controllers/alertController');

router.get('/', getAllAlerts);
router.post('/', createAlert);
router.put('/:id/deactivate', deactivateAlert);

module.exports = router;