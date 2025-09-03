import db from '../../../database/db.js';
import sequelize from 'sequelize';

let CajaChica = db.define('cajas_chicas', {
  id: {
    type: sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    validate: { notEmpty: true }
  },
  nombre: {
    type: sequelize.STRING,
  },
  estado: {
    type: sequelize.STRING,
  }
}, {
  timestamps: false
});

export default CajaChica;