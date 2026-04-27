const { DataTypes } = require('sequelize');
const sequelize     = require('../config/database');

const Hotel = sequelize.define('Hotel', {
  id:          { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  code:        { type: DataTypes.STRING(50),  allowNull: false, unique: true },
  nom:         { type: DataTypes.STRING(100), allowNull: false },
  province:    { type: DataTypes.STRING(100), allowNull: false },
  description: { type: DataTypes.TEXT },
  image_url:   { type: DataTypes.STRING(500) },
  adresse:     { type: DataTypes.STRING(200) },
  telephone:   { type: DataTypes.STRING(50) },
  email:       { type: DataTypes.STRING(100) },
  prix_depuis: { type: DataTypes.INTEGER, defaultValue: 0 },
  nb_chambres: { type: DataTypes.INTEGER, defaultValue: 0 },
  actif:       { type: DataTypes.BOOLEAN, defaultValue: true }
}, { tableName: 'hotels' });

module.exports = Hotel;