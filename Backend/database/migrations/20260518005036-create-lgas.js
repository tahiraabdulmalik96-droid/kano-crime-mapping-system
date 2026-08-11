'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('lgas', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true
      },
      population: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      area_sqkm: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      safety_score: {
        type: Sequelize.DECIMAL(4, 2),
        defaultValue: 0
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('lgas');
  }
};
