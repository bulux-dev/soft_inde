import db from '../../../database/db.js';
import sequelize from 'sequelize';

let Inventario = db.define('inventarios', {
  id: {
    type: sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    validate: { notEmpty: true }
  },
  mes: {
    type: sequelize.STRING
  },
  estado: {
    type: sequelize.STRING
  }
}, {
  timestamps: false
});

export default Inventario;