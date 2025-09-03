import db from '../../../database/db.js';
import sequelize from 'sequelize';
import Documento from '../../facturacion/documentos/documentos.model.js';
import Proveedor from '../../personal/proveedores/proveedores.model.js';
import Sucursal from '../../ubicaciones/sucursales/sucursales.model.js';
import Bodega from '../../ubicaciones/bodegas/bodegas.model.js';
import Moneda from '../../facturacion/monedas/monedas.model.js';
import CuentaBancaria from '../../finanzas/cuentas_bancarias/cuentas_bancarias.model.js';
import Usuario from '../../seguridad/usuarios/usuarios.model.js';

let NDProveedor = db.define('nd_proveedores', {
  id: {
    type: sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    validate: { notEmpty: true }
  },
  no_nd: {
    type: sequelize.STRING,
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
  total: {
    type: sequelize.DECIMAL
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

NDProveedor.belongsTo(Documento, { foreignKey: 'documento_id', as: 'documento' });
Documento.hasMany(NDProveedor, { foreignKey: 'documento_id', as: 'nd_proveedores' });

NDProveedor.belongsTo(Sucursal, { foreignKey: 'sucursal_id', as: 'sucursal' });
Sucursal.hasMany(NDProveedor, { foreignKey: 'sucursal_id', as: 'nd_proveedores' });

NDProveedor.belongsTo(Bodega, { foreignKey: 'bodega_id', as: 'bodega' });
Bodega.hasMany(NDProveedor, { foreignKey: 'bodega_id', as: 'nd_proveedores' });

NDProveedor.belongsTo(Proveedor, { foreignKey: 'proveedor_id', as: 'proveedor' });
Proveedor.hasMany(NDProveedor, { foreignKey: 'proveedor_id', as: 'nd_proveedores' });

NDProveedor.belongsTo(Moneda, { foreignKey: 'moneda_id', as: 'moneda' });
Moneda.hasMany(NDProveedor, { foreignKey: 'moneda_id', as: 'nd_proveedores' });

NDProveedor.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });
Usuario.hasMany(NDProveedor, { foreignKey: 'usuario_id', as: 'nd_proveedor' });

export default NDProveedor;