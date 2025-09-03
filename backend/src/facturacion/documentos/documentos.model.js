import db from '../../../database/db.js';
import sequelize from 'sequelize';
import TipoDocumento from '../tipos_documentos/tipos_documentos.model.js';
import Sucursal from '../../ubicaciones/sucursales/sucursales.model.js';
import Usuario from '../../seguridad/usuarios/usuarios.model.js';
import Bodega from '../../ubicaciones/bodegas/bodegas.model.js';

let Documento = db.define('documentos', {
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
  slug: {
    type: sequelize.STRING
  },
  serie: {
    type: sequelize.STRING,
    allowNull: false,
    validate: { notEmpty: true }
  },
  correlativo: {
    type: sequelize.STRING
  },
  color: {
    type: sequelize.STRING
  },
  cambiaria: {
    type: sequelize.BOOLEAN
  },
  inventario: {
    type: sequelize.BOOLEAN
  },
  certificacion: {
    type: sequelize.BOOLEAN
  },
  tipo_documento_id: {
    type: sequelize.INTEGER
  },
  sucursal_id: {
    type: sequelize.INTEGER
  },
  bodega_id: {
    type: sequelize.INTEGER
  },
  usuario_id: {
    type: sequelize.INTEGER
  }
}, {
  timestamps: false
});

Documento.belongsTo(TipoDocumento, { foreignKey: 'tipo_documento_id', as: 'tipo_documento' });
TipoDocumento.hasMany(Documento, { foreignKey: 'tipo_documento_id', as: 'documentos' });

Documento.belongsTo(Sucursal, { foreignKey: 'sucursal_id', as: 'sucursal' });
Sucursal.hasMany(Documento, { foreignKey: 'sucursal_id', as: 'documentos' });

Documento.belongsTo(Bodega, { foreignKey: 'bodega_id', as: 'bodega' });
Bodega.hasMany(Documento, { foreignKey: 'bodega_id', as: 'documentos' });

Documento.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });
Usuario.hasMany(Documento, {foreignKey: 'usuario_id', as: 'documentos' })


export default Documento;