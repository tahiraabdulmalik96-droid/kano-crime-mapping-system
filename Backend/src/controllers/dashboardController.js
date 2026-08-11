const { CrimeReport, LGA } = require('../models');
const { Op } = require('sequelize');

const KANO_CITY_LGAS = [1, 2, 3, 4, 5, 6, 7];

const getWeeklyStats = async (req, res) => {
  try {
    const { week_start, week_end } = req.query;

    const start = week_start ? new Date(week_start) : (() => {
      const d = new Date();
      d.setDate(d.getDate() - d.getDay());
      d.setHours(0, 0, 0, 0);
      return d;
    })();

    const end = week_end ? new Date(week_end) : (() => {
      const d = new Date();
      d.setDate(d.getDate() + (6 - d.getDay()));
      d.setHours(23, 59, 59, 999);
      return d;
    })();

    // Get crimes only for Kano City 7 LGAs
    const crimes = await CrimeReport.findAll({
      where: {
        occurred_at: {
          [Op.between]: [start, end]
        },
        lga_id: {
          [Op.in]: KANO_CITY_LGAS
        }
      }
    });

    // Get only Kano City 7 LGAs
    const lgas = await LGA.findAll({
      where: {
        id: {
          [Op.in]: KANO_CITY_LGAS
        }
      }
    });

    const lgaStats = lgas.map(lga => {
      const lgaCrimes = crimes.filter(c => c.lga_id === lga.id);
      const total = lgaCrimes.length;
      const pending = lgaCrimes.filter(c => c.status === 'pending').length;
      const verified = lgaCrimes.filter(c => c.status === 'verified').length;
      const risk = total >= 3 ? 'High' : total === 2 ? 'Medium' : 'Low';

      return {
        id: lga.id,
        name: lga.name,
        cases: total,
        pending,
        verified,
        risk,
      };
    });

    const totalCases = crimes.length;
    const totalPending = crimes.filter(c => c.status === 'pending').length;
    const totalVerified = crimes.filter(c => c.status === 'verified').length;
    const highRisk = lgaStats.filter(l => l.risk === 'High').length;

    const crimeTypes = {};
    crimes.forEach(crime => {
      crimeTypes[crime.title] = (crimeTypes[crime.title] || 0) + 1;
    });

    res.json({
      week_start: start,
      week_end: end,
      totalCases,
      totalPending,
      totalVerified,
      highRisk,
      lgaStats,
      crimeTypes,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getWeeklyStats };