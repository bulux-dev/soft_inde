import db from '../../database/db.js';
import sequelize from 'sequelize';
import Usuario from './usuarios/usuarios.model.js';

let Bitacora = db.define('bitacora', {
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
    type: sequelize.STRING,
    allowNull: true
  },
  url: {
    type: sequelize.STRING,
    allowNull: true
  },
  params: {
    type: sequelize.TEXT,
    allowNull: true
  },
  body: {
    type: sequelize.TEXT,
    allowNull: true
  },
  mensaje: {
    type: sequelize.TEXT,
    allowNull: true
  },
  dispositivo: {
    type: sequelize.STRING,
    allowNull: true
  },
  usuario_id: {
    type: sequelize.INTEGER,
    allowNull: true
  }
}, {
  freezeTableName: true,
  tableName: 'bitacora'
});

Bitacora.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });
Usuario.hasMany(Bitacora, { foreignKey: 'usuario_id', as: 'bitacoras' });

export default Bitacora;