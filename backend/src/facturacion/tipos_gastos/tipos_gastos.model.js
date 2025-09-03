import db from '../../../database/db.js';
import sequelize from 'sequelize';

let TipoGasto = db.define('tipos_gastos', {
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
  }
}, {
  timestamps: false
});

export default TipoGasto;