import db from '../../../database/db.js';
import sequelize from 'sequelize';

let Atributo = db.define('atributos', {
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

export default Atributo;