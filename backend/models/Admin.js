const { DataTypes } = require('sequelize');
const sequelize     = require('../config/database');

const Admin = sequelize.define('Admin', {
  id:           { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  prenom:       { type: DataTypes.STRING(100), allowNull: false },
  nom:          { type: DataTypes.STRING(100), allowNull: false },
  email:        { type: DataTypes.STRING(150), allowNull: false, unique: true,
                  validate: { isEmail: true } },
  mot_de_passe: { type: DataTypes.STRING(255), allowNull: false },
  role:         { type: DataTypes.ENUM('super_admin','admin','receptionniste'),
                  defaultValue: 'admin' },
  actif:        { type: DataTypes.BOOLEAN, defaultValue: true },
  dernier_login:{ type: DataTypes.DATE, allowNull: true }
}, {
  tableName: 'admins',
  defaultScope: { attributes: { exclude: ['mot_de_passe'] } },
  scopes: { avecMotDePasse: { attributes: {} } }
});

module.exports = Admin;