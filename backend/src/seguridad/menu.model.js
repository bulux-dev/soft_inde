import db from '../../database/admin.js';
import sequelize from 'sequelize';
import Modulo from './modulo.model.js';

let Menu = db.define('menus', {
  id: { type: sequelize.INTEGER, primaryKey: true },
  nombre: sequelize.STRING,
  slug: sequelize.STRING,
  icono: sequelize.STRING,
  modulo_id: sequelize.INTEGER,
}, {
  schema: "admin" 
});

Menu.belongsTo(Modulo, { foreignKey: 'modulo_id', as: 'modulo' });
Modulo.hasMany(Menu, { foreignKey: 'modulo_id', as: 'menus' });

export default Menu;