import db from '../../../database/db.js';
import sequelize from 'sequelize';

let Impresora = db.define('impresoras', {
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
  ip: {
    type: sequelize.STRING
  },
  tabs: {
    type: sequelize.STRING
  }
});

export default Impresora;