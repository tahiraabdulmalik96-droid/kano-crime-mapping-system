'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class CrimeReport extends Model {}

  CrimeReport.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    lga_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    reported_by: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: false
    },
    longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: false
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    occurred_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    reported_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    status: {
      type: DataTypes.ENUM('pending', 'verified', 'rejected'),
      defaultValue: 'pending'
    },
    source: {
      type: DataTypes.ENUM('police', 'public', 'simulated'),
      allowNull: false
    },
    victim_count: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    }
  }, {
    sequelize,
    modelName: 'CrimeReport',
    tableName: 'crime_reports',
    timestamps: false
  });

  return CrimeReport;
};