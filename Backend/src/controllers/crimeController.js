const { CrimeReport } = require('../models');

// Get all crimes
const getAllCrimes = async (req, res) => {
  try {
    const crimes = await CrimeReport.findAll();
    res.json({ crimes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single crime
const getCrimeById = async (req, res) => {
  try {
    const crime = await CrimeReport.findByPk(req.params.id);
    if (!crime) {
      return res.status(404).json({ message: 'Crime report not found' });
    }
    res.json({ crime });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create crime
const createCrime = async (req, res) => {
  try {
    const {
      title, description, category_id,
      lga_id, latitude, longitude,
      address, occurred_at, source,
      victim_count
    } = req.body;

    const crime = await CrimeReport.create({
      title,
      description,
      category_id,
      lga_id,
      latitude,
      longitude,
      address,
      occurred_at,
      source,
      victim_count,
      reported_by: req.user?.id
    });

    res.status(201).json({
      message: 'Crime report created successfully',
      crime
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update crime status
const updateCrimeStatus = async (req, res) => {
  try {
    const crime = await CrimeReport.findByPk(req.params.id);
    if (!crime) {
      return res.status(404).json({ message: 'Crime report not found' });
    }
    await crime.update({ status: req.body.status });
    res.json({ message: 'Status updated successfully', crime });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete crime
const deleteCrime = async (req, res) => {
  try {
    const crime = await CrimeReport.findByPk(req.params.id);
    if (!crime) {
      return res.status(404).json({ message: 'Crime report not found' });
    }
    await crime.destroy();
    res.json({ message: 'Crime report deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllCrimes,
  getCrimeById,
  createCrime,
  updateCrimeStatus,
  deleteCrime
};