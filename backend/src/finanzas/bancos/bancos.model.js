import db from '../../../database/db.js';
import sequelize from 'sequelize';

let Banco = db.define('bancos', {
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
  siglas: {
    type: sequelize.DECIMAL,
  }
}, {
  timestamps: false
});

export default Banco;