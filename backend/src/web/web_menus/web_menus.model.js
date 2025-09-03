import db from '../../../database/db.js';
import sequelize from 'sequelize';

let WebMenu = db.define('web_menus', {
  nombre: {
    type: sequelize.STRING,
    allowNull: false,
    validate: { notEmpty: true }
  },
  link: {
    type: sequelize.STRING,
    allowNull: false,
    validate: { notEmpty: true }
  },
  orden: {
    type: sequelize.STRING
  },
  icono: {
    type: sequelize.STRING
  }
});

export default WebMenu;