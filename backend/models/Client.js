const { DataTypes } = require('sequelize');
const sequelize     = require('../config/database');

const Client = sequelize.define('Client', {
  id:           { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  prenom:       { type: DataTypes.STRING(100), allowNull: false },
  nom:          { type: DataTypes.STRING(100), allowNull: false },
  email:        { type: DataTypes.STRING(150), allowNull: false, unique: true,
                  validate: { isEmail: true } },
  telephone:    { type: DataTypes.STRING(50) },
  nationalite:  { type: DataTypes.STRING(100) },
  actif:        { type: DataTypes.BOOLEAN, defaultValue: true }
}, { tableName: 'clients' });

module.exports = Client;