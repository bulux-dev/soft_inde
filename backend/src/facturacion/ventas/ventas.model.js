import db from '../../../database/db.js';
import sequelize from 'sequelize';
import Documento from '../documentos/documentos.model.js';
import Cliente from '../../personal/clientes/clientes.model.js';
import Sucursal from '../../ubicaciones/sucursales/sucursales.model.js';
import Bodega from '../../ubicaciones/bodegas/bodegas.model.js';
import Moneda from '../monedas/monedas.model.js';
import Usuario from '../../seguridad/usuarios/usuarios.model.js';
import Empleado from '../../personal/empleados/empleados.model.js';

let Venta = db.define('ventas', {
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
  cambiaria: {
    type: sequelize.BOOLEAN
  },
  estado: {
    type: sequelize.STRING
  },
  fel_numero: {
    type: sequelize.STRING
  },
  fel_serie: {
    type: sequelize.STRING
  },
  fel_autorizacion: {
    type: sequelize.INTEGER
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
    type: sequelize.INTEGER,
    allowNull: false,
    validate: { notEmpty: true }
  },
  cliente_id: {
    type: sequelize.INTEGER,
    allowNull: false,
    validate: { notEmpty: true }
  },
  moneda_id: {
    type: sequelize.INTEGER,
    allowNull: false,
    validate: { notEmpty: true }
  },
  empleado_id: {
    type: sequelize.INTEGER,
  },
  usuario_id: {
    type: sequelize.INTEGER,
    allowNull: false,
    validate: { notEmpty: true }
  }
}, {
  timestamps: false
});

Venta.belongsTo(Documento, { foreignKey: 'documento_id', as: 'documento' });
Documento.hasMany(Venta, { foreignKey: 'documento_id', as: 'ventas' });

Venta.belongsTo(Sucursal, { foreignKey: 'sucursal_id', as: 'sucursal' });
Sucursal.hasMany(Venta, { foreignKey: 'sucursal_id', as: 'ventas' });

Venta.belongsTo(Bodega, { foreignKey: 'bodega_id', as: 'bodega' });
Bodega.hasMany(Venta, { foreignKey: 'bodega_id', as: 'ventas' });

Venta.belongsTo(Cliente, { foreignKey: 'cliente_id', as: 'cliente' });
Cliente.hasMany(Venta, { foreignKey: 'cliente_id', as: 'ventas' });

Venta.belongsTo(Moneda, { foreignKey: 'moneda_id', as: 'moneda' });
Moneda.hasMany(Venta, { foreignKey: 'moneda_id', as: 'ventas' });

Venta.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });
Usuario.hasMany(Venta, { foreignKey: 'usuario_id', as: 'ventas' });

Venta.belongsTo(Empleado, { foreignKey: 'empleado_id', as: 'empleado' });
Empleado.hasMany(Venta, { foreignKey: 'empleado_id', as: 'ventas' });

export default Venta;