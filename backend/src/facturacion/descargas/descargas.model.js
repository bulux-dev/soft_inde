import db from '../../../database/db.js';
import sequelize from 'sequelize';
import Documento from '../documentos/documentos.model.js';
import Cliente from '../../personal/clientes/clientes.model.js';
import Sucursal from '../../ubicaciones/sucursales/sucursales.model.js';
import Bodega from '../../ubicaciones/bodegas/bodegas.model.js';
import Usuario from '../../seguridad/usuarios/usuarios.model.js';

let Descarga = db.define('descargas', {
  id: {
    type: sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    validate: { notEmpty: true }
  },
  serie: {
    type: sequelize.STRING,
    allowNull: false,
    validate: { notEmpty: true }
  },
  correlativo: {
    type: sequelize.INTEGER,
    allowNull: false,
    validate: { notEmpty: true }
  },
  fecha: {
    type: sequelize.STRING,
    allowNull: false,
    validate: { notEmpty: true }
  },
  observaciones: {
    type: sequelize.TEXT
  },
  estado: {
    type: sequelize.STRING
  },
  fecha_anulacion: {
    type: sequelize.STRING
  },
  motivo_anulacion: {
    type: sequelize.STRING
  },
  documento_id: {
    type: sequelize.INTEGER,
    allowNull: false,
    validate: { notEmpty: true }
  },
  sucursal_id: {
    type: sequelize.INTEGER,
    allowNull: false,
    validate: { notEmpty: true }
  },
  bodega_id: {
    type: sequelize.INTEGER
  },
  cliente_id: {
    type: sequelize.INTEGER,
    allowNull: false,
    validate: { notEmpty: true }
  },
  usuario_id: {
    type: sequelize.INTEGER,
    allowNull: false,
    validate: { notEmpty: true }
  }
}, {
  timestamps: false
});

Descarga.belongsTo(Documento, { foreignKey: 'documento_id', as: 'documento' });
Documento.hasMany(Descarga, { foreignKey: 'documento_id', as: 'descargas' });

Descarga.belongsTo(Sucursal, { foreignKey: 'sucursal_id', as: 'sucursal' });
Sucursal.hasMany(Descarga, { foreignKey: 'sucursal_id', as: 'descargas' });

Descarga.belongsTo(Bodega, { foreignKey: 'bodega_id', as: 'bodega' });
Bodega.hasMany(Descarga, { foreignKey: 'bodega_id', as: 'descargas' });

Descarga.belongsTo(Cliente, { foreignKey: 'cliente_id', as: 'cliente' });
Cliente.hasMany(Descarga, { foreignKey: 'cliente_id', as: 'descargas' });

Descarga.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });
Usuario.hasMany(Descarga, { foreignKey: 'usuario_id', as: 'descargas' });

export default Descarga;