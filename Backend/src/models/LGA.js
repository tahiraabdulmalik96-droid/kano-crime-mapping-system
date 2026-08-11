'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class LGA extends Model {}

  LGA.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    population: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    area_sqkm: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    safety_score: {
      type: DataTypes.DECIMAL(4, 2),
      defaultValue: 0
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'LGA',
    tableName: 'lgas',
    timestamps: false
  });

  return LGA;
};