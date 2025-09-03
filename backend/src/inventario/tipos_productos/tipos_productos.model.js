import db from '../../../database/db.js';
import sequelize from 'sequelize';

let TipoProducto = db.define('tipos_productos', {
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

export default TipoProducto;