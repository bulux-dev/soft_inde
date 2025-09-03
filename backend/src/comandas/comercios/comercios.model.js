import db from '../../../database/db.js';
import sequelize from 'sequelize';

let Comercio = db.define('comercios', {
  id: {
    type: sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    validate: { notEmpty: true }
  },
  nombre: {
    type: sequelize.STRING
  },
  operador: {
    type: sequelize.STRING
  }
}, {
  timestamps: false
});

export default Comercio;