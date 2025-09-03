import db from '../../../database/db.js';
import sequelize from 'sequelize';
import Documento from '../documentos/documentos.model.js';
import Proveedor from '../../personal/proveedores/proveedores.model.js'
import Sucursal from '../../ubicaciones/sucursales/sucursales.model.js';
import Bodega from '../../ubicaciones/bodegas/bodegas.model.js';
import Moneda from '../monedas/monedas.model.js';
import Usuario from '../../seguridad/usuarios/usuarios.model.js';
import Compra from '../compras/compras.model.js';

let OrdenCompra = db.define('ordenes_compras', {
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
  },
  compra_id: {
    type: sequelize.INTEGER
  },
}, {
  timestamps: false
});

OrdenCompra.belongsTo(Documento, { foreignKey: 'documento_id', as: 'documento' });
Documento.hasMany(OrdenCompra, { foreignKey: 'documento_id', as: 'ordenes_compras' });

OrdenCompra.belongsTo(Sucursal, { foreignKey: 'sucursal_id', as: 'sucursal' });
Sucursal.hasMany(OrdenCompra, { foreignKey: 'sucursal_id', as: 'ordenes_compras' });

OrdenCompra.belongsTo(Bodega, { foreignKey: 'bodega_id', as: 'bodega' });
Bodega.hasMany(OrdenCompra, { foreignKey: 'bodega_id', as: 'ordenes_compras' });

OrdenCompra.belongsTo(Proveedor, { foreignKey: 'proveedor_id', as: 'proveedor' });
Proveedor.hasMany(OrdenCompra, { foreignKey: 'proveedor_id', as: 'ordenes_compras' });

OrdenCompra.belongsTo(Moneda, { foreignKey: 'moneda_id', as: 'moneda' });
Moneda.hasMany(OrdenCompra, { foreignKey: 'moneda_id', as: 'ordenes_compras' });

OrdenCompra.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });
Usuario.hasMany(OrdenCompra, { foreignKey: 'usuario_id', as: 'ordenes_compras' });

OrdenCompra.belongsTo(Compra, { foreignKey: 'compra_id', as: 'compra' });
Compra.hasMany(OrdenCompra, { foreignKey: 'compra_id', as: 'ordenes_compras' });

export default OrdenCompra;