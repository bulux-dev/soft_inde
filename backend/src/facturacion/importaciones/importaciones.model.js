import db from '../../../database/db.js';
import sequelize from 'sequelize';
import Documento from '../documentos/documentos.model.js';
import Proveedor from '../../personal/proveedores/proveedores.model.js'
import Sucursal from '../../ubicaciones/sucursales/sucursales.model.js';
import Bodega from '../../ubicaciones/bodegas/bodegas.model.js';
import Moneda from '../monedas/monedas.model.js';
import Usuario from '../../seguridad/usuarios/usuarios.model.js';

let Importacion = db.define('importaciones', {
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
  no_doc: {
    type: sequelize.STRING
  },
  fecha: {
    type: sequelize.STRING,
    allowNull: false,
    validate: { notEmpty: true }
  },
  observaciones: {
    type: sequelize.TEXT
  },
  descuento: {
    type: sequelize.DECIMAL
  },
  total: {
    type: sequelize.DECIMAL
  },
  subtotal: {
    type: sequelize.DECIMAL
  },
  impuesto: {
    type: sequelize.DECIMAL
  },
  factor: {
    type: sequelize.DECIMAL
  },
  descuento_ext: {
    type: sequelize.DECIMAL
  },
  total_ext: {
    type: sequelize.DECIMAL
  },
  subtotal_ext: {
    type: sequelize.DECIMAL
  },
  impuesto_ext: {
    type: sequelize.DECIMAL
  },
  factor_ext: {
    type: sequelize.DECIMAL
  },
  tipo_prorrateo: {
    type: sequelize.STRING
  },
  tipo_pago: {
    type: sequelize.STRING
  },
  tipo_cambio: {
    type: sequelize.STRING
  },
  dias_credito: {
    type: sequelize.STRING
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
  gravable: {
    type: sequelize.BOOLEAN
  },
  libro: {
    type: sequelize.BOOLEAN
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
  proveedor_id: {
    type: sequelize.INTEGER,
    allowNull: false,
    validate: { notEmpty: true }
  },
  moneda_id: {
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

Importacion.belongsTo(Documento, { foreignKey: 'documento_id', as: 'documento' });
Documento.hasMany(Importacion, { foreignKey: 'documento_id', as: 'importaciones' });

Importacion.belongsTo(Sucursal, { foreignKey: 'sucursal_id', as: 'sucursal' });
Sucursal.hasMany(Importacion, { foreignKey: 'sucursal_id', as: 'importaciones' });

Importacion.belongsTo(Bodega, { foreignKey: 'bodega_id', as: 'bodega' });
Bodega.hasMany(Importacion, { foreignKey: 'bodega_id', as: 'importaciones' });

Importacion.belongsTo(Proveedor, { foreignKey: 'proveedor_id', as: 'proveedor' });
Proveedor.hasMany(Importacion, { foreignKey: 'proveedor_id', as: 'importaciones' });

Importacion.belongsTo(Moneda, { foreignKey: 'moneda_id', as: 'moneda' });
Moneda.hasMany(Importacion, { foreignKey: 'moneda_id', as: 'importaciones' });

Importacion.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });
Usuario.hasMany(Importacion, { foreignKey: 'usuario_id', as: 'importaciones' });

export default Importacion;