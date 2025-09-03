import db from '../../../database/db.js';
import sequelize from 'sequelize';
import WebMenu from '../web_menus/web_menus.model.js';

let WebSeccion = db.define('web_secciones', {
  id: {
    type: sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: sequelize.STRING,
    allowNull: false,
    validate: { notEmpty: true }
  },
  orden: {
    type: sequelize.STRING
  },
  web_menu_id: {
    type: sequelize.INTEGER
  }
});

WebSeccion.belongsTo(WebMenu, { foreignKey: 'web_menu_id', as: 'web_menu' });
WebMenu.hasMany(WebSeccion, { foreignKey: 'web_menu_id', as: 'web_secciones' });

export default WebSeccion;