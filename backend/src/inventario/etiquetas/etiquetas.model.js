import db from '../../../database/db.js';
import sequelize from 'sequelize';

let Etiqueta = db.define('etiquetas', {
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
  estado: {
    type: sequelize.BOOLEAN
  }
}, {
  timestamps: false
});

export default Etiqueta;