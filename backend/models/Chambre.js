const { DataTypes } = require('sequelize');
const sequelize     = require('../config/database');

const Chambre = sequelize.define('Chambre', {
  id:          { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  hotel_id:    { type: DataTypes.INTEGER, allowNull: false },
  type:        { type: DataTypes.ENUM('standard','superieure','suite','presidentielle'),
                 allowNull: false },
  nom:         { type: DataTypes.STRING(100), allowNull: false },
  description: { type: DataTypes.TEXT },
  prix:        { type: DataTypes.INTEGER, allowNull: false },
  superficie:  { type: DataTypes.INTEGER },
  capacite:    { type: DataTypes.INTEGER, defaultValue: 2 },
  image_url:   { type: DataTypes.STRING(500) },
  disponible:  { type: DataTypes.BOOLEAN, defaultValue: true }
}, { tableName: 'chambres' });

module.exports = Chambre;