const { LGA } = require('../models');

// Get all LGAs
const getAllLGAs = async (req, res) => {
  try {
    const lgas = await LGA.findAll();
    res.json({ lgas });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single LGA
const getLGAById = async (req, res) => {
  try {
    const lga = await LGA.findByPk(req.params.id);
    if (!lga) {
      return res.status(404).json({ message: 'LGA not found' });
    }
    res.json({ lga });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create LGA
const createLGA = async (req, res) => {
  try {
    const { name, population, area_sqkm } = req.body;
    const lga = await LGA.create({
      name,
      population,
      area_sqkm
    });
    res.status(201).json({
      message: 'LGA created successfully',
      lga
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update safety score
const updateSafetyScore = async (req, res) => {
  try {
    const lga = await LGA.findByPk(req.params.id);
    if (!lga) {
      return res.status(404).json({ message: 'LGA not found' });
    }
    await lga.update({ safety_score: req.body.safety_score });
    res.json({ message: 'Safety score updated', lga });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllLGAs,
  getLGAById,
  createLGA,
  updateSafetyScore
};