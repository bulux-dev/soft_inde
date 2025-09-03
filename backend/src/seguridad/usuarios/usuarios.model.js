import db from '../../../database/db.js';
import sequelize from 'sequelize';
import Rol from '../roles/roles.model.js';

let Usuario = db.define('usuarios', {
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
  },
  apellido: {
    type: sequelize.STRING,
    allowNull: false,
    validate: { notEmpty: true }
  },
  usuario: {
    type: sequelize.STRING,
    unique: true,
    allowNull: false,
    validate: { notEmpty: true }
  },
  clave: {
    type: sequelize.STRING,
    allowNull: false,
    validate: { notEmpty: true,  isLength: { min: 6 } }
  },
  correo: {
    type: sequelize.STRING
  },
  telefono: {
    type: sequelize.STRING
  },
  acceso: { 
    type: sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: true ,
    validate: { notEmpty: true, isBoolean: true }
  },
  logo: {
    type: sequelize.TEXT
  },
  rol_id: {
    type: sequelize.INTEGER,
    allowNull: false,
    defaultValue: 1,
    validate: { notEmpty: true }
  }
});

Usuario.belongsTo(Rol, { foreignKey: 'rol_id', as: 'rol' });
Rol.hasMany(Usuario, { foreignKey: 'rol_id', as: 'usuarios' });

export default Usuario;