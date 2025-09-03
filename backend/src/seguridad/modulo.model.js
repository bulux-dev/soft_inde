import db from '../../database/admin.js';
import sequelize from 'sequelize';

let Modulo = db.define('modulos', {
  id: { type: sequelize.INTEGER, primaryKey: true },
  nombre: sequelize.STRING,
  slug: sequelize.STRING,
  icono: sequelize.STRING,
  inscripcion: sequelize.STRING,
  membresia: sequelize.STRING,
}, {
  schema: "admin" 
});

export default Modulo;