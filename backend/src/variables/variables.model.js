import db from '../../database/db.js';
import sequelize from 'sequelize';

let Variable = db.define('variables', {
  nombre: {
    type: sequelize.STRING,
    allowNull: false,
    validate: { notEmpty: true }
  },
  slug: {
    type: sequelize.STRING,
    primaryKey: true,
    allowNull: false,
    validate: { notEmpty: true }
  },
  valor: {
    type: sequelize.STRING,
    allowNull: false,
    validate: { notEmpty: true }
  },
  opciones: {
    type: sequelize.STRING
  }
});

export default Variable;