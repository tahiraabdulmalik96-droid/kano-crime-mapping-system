const { Alert } = require('../models');

// Get all alerts
const getAllAlerts = async (req, res) => {
  try {
    const alerts = await Alert.findAll({
      where: { is_active: true },
      order: [['created_at', 'DESC']]
    });
    res.json({ alerts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create alert
const createAlert = async (req, res) => {
  try {
    const { lga_id, title, message, severity } = req.body;
    const alert = await Alert.create({
      lga_id,
      title,
      message,
      severity,
      created_by: null,
      is_active: true,
    });
    res.status(201).json({
      message: 'Alert created successfully',
      alert
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Deactivate alert
const deactivateAlert = async (req, res) => {
  try {
    const alert = await Alert.findByPk(req.params.id);
    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }
    await alert.update({ is_active: false });
    res.json({ message: 'Alert deactivated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllAlerts, createAlert, deactivateAlert };