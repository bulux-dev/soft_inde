import db from '../../database/admin.js';
import sequelize from 'sequelize';

let Accion = db.define('acciones', {
  id: { type: sequelize.INTEGER, primaryKey: true },
  nombre: sequelize.STRING,
  slug: sequelize.STRING,
  menu_id: sequelize.INTEGER,
}, {
  schema: "admin" 
});

export default Accion;