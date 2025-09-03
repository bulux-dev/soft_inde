import db from '../../../database/db.js';
import sequelize from 'sequelize';

let Moneda = db.define('monedas', {
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
  simbolo: {
    type: sequelize.STRING,
    allowNull: false,
    validate: { notEmpty: true }
  },
  tipo_cambio: {
    type: sequelize.DECIMAL
  }
}, {
  timestamps: false
});

export default Moneda;