import db from '../../../database/db.js';
import sequelize from 'sequelize';
import Modulo from '../modulo.model.js';
import Menu from '../menu.model.js';
import Accion from '../accion.model.js';

let Permiso = db.define('permisos', {
  id: { 
    type: sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    validate: { notEmpty: true }
  },
  modulo_id: {
    type: sequelize.INTEGER,
  },
  menu_id: {
    type: sequelize.INTEGER,
  },
  accion_id: {
    type: sequelize.INTEGER,
  },
  rol_id: {
    type: sequelize.INTEGER,
  },
  usuario_id: {
    type: sequelize.INTEGER,
  }
});

Permiso.belongsTo(Modulo, { foreignKey: 'modulo_id', as: 'modulo' });
Modulo.hasMany(Permiso, { foreignKey: 'modulo_id', as: 'permisos' });

Permiso.belongsTo(Menu, { foreignKey: 'menu_id', as: 'menu' });
Menu.hasMany(Permiso, { foreignKey: 'menu_id', as: 'permisos' });

Permiso.belongsTo(Accion, { foreignKey: 'accion_id', as: 'accion' });
Accion.hasMany(Permiso, { foreignKey: 'accion_id', as: 'permisos' });

export default Permiso;