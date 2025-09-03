import db from '../../../database/db.js';
import sequelize from 'sequelize';

let Rol = db.define('roles', {
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
});

export default Rol;