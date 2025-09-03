import db from '../../../database/db.js';
import sequelize from 'sequelize';
import Usuario from '../../seguridad/usuarios/usuarios.model.js';

let Error = db.define('errores', {
  id: { 
    type: sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    validate: { notEmpty: true }
  },
  fecha: {
    type: sequelize.STRING,
    allowNull: false,
    validate: { notEmpty: true }
  },
  tipo: {
    type: sequelize.TEXT,
    allowNull: false,
    validate: { notEmpty: true }
  },
  url: {
    type: sequelize.TEXT,
    allowNull: false,
    validate: { notEmpty: true }
  },
  params: {
    type: sequelize.TEXT,
    allowNull: false,
    validate: { notEmpty: true }
  },
  body: {
    type: sequelize.TEXT,
    allowNull: false,
    validate: { notEmpty: true }
  },
  mensaje: {
    type: sequelize.TEXT,
    allowNull: false,
    validate: { notEmpty: true }
  },
  dispositivo: {
    type: sequelize.TEXT,
    allowNull: true
  },
  usuario_id: {
    type: sequelize.INTEGER,
    allowNull: true
  }
});

Error.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });
Usuario.hasMany(Error, { foreignKey: 'usuario_id', as: 'errores' });

export default Error;