import db from '../../../database/db.js';
import sequelize from 'sequelize';

let Sucursal = db.define('sucursales', {
  id: {
    type: sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    validate: { notEmpty: true }
  },
  nombre: {
    type: sequelize.STRING,
    allowNull: false,
    validate: { notEmpty: true }
  },
  numero: {
    type: sequelize.STRING,
  },
  direccion: {
    type: sequelize.TEXT,
  },
  telefono: {
    type: sequelize.STRING,
  }
}, {
  timestamps: false
});

export default Sucursal;