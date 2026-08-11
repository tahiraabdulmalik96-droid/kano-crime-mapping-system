'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('hotspots', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      lga_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'lgas',
          key: 'id'
        }
      },
      crime_count: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      density_score: {
        type: Sequelize.DECIMAL(6, 3),
        allowNull: false
      },
      risk_level: {
        type: Sequelize.ENUM('low', 'medium', 'high', 'critical'),
        allowNull: false
      },
      latitude: {
        type: Sequelize.DECIMAL(10, 8),
        allowNull: false
      },
      longitude: {
        type: Sequelize.DECIMAL(11, 8),
        allowNull: false
      },
      computed_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      valid_until: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('hotspots');
  }
};