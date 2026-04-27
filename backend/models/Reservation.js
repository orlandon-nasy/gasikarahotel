const { DataTypes } = require('sequelize');
const sequelize     = require('../config/database');

const Reservation = sequelize.define('Reservation', {
  id:           { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  reference:    { type: DataTypes.STRING(20), allowNull: false, unique: true },
  prenom:       { type: DataTypes.STRING(100), allowNull: false },
  nom:          { type: DataTypes.STRING(100), allowNull: false },
  email:        { type: DataTypes.STRING(150), allowNull: false },
  telephone:    { type: DataTypes.STRING(50) },
  hotel_id:     { type: DataTypes.INTEGER, allowNull: false },
  chambre_id:   { type: DataTypes.INTEGER },
  client_id:    { type: DataTypes.INTEGER },
  arrivee:      { type: DataTypes.DATEONLY, allowNull: false },
  depart:       { type: DataTypes.DATEONLY, allowNull: false },
  nb_nuits:     { type: DataTypes.INTEGER, allowNull: false },
  adultes:      { type: DataTypes.INTEGER, defaultValue: 2 },
  enfants:      { type: DataTypes.INTEGER, defaultValue: 0 },
  prix_total:   { type: DataTypes.INTEGER },
  demandes:     { type: DataTypes.TEXT },
  statut:       { type: DataTypes.ENUM('en_attente','confirmee','annulee'),
                  defaultValue: 'en_attente' },
  email_envoye: { type: DataTypes.BOOLEAN, defaultValue: false }
}, { tableName: 'reservations' });

module.exports = Reservation;