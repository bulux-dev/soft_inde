import db from '../../../database/db.js';
import sequelize from 'sequelize';
import Documento from '../documentos/documentos.model.js';
import Cliente from '../../personal/clientes/clientes.model.js';
import Sucursal from '../../ubicaciones/sucursales/sucursales.model.js';
import Bodega from '../../ubicaciones/bodegas/bodegas.model.js';
import Moneda from '../monedas/monedas.model.js';
import Usuario from '../../seguridad/usuarios/usuarios.model.js';
import Empleado from '../../personal/empleados/empleados.model.js';
import Venta from '../ventas/ventas.model.js';

let Pedido = db.define('pedidos', {
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
  },
  venta_id: {
    type: sequelize.INTEGER
  }
}, {
  timestamps: false
});

Pedido.belongsTo(Documento, { foreignKey: 'documento_id', as: 'documento' });
Documento.hasMany(Pedido, { foreignKey: 'documento_id', as: 'pedidos' });

Pedido.belongsTo(Sucursal, { foreignKey: 'sucursal_id', as: 'sucursal' });
Sucursal.hasMany(Pedido, { foreignKey: 'sucursal_id', as: 'pedidos' });

Pedido.belongsTo(Bodega, { foreignKey: 'bodega_id', as: 'bodega' });
Bodega.hasMany(Pedido, { foreignKey: 'bodega_id', as: 'pedidos' });

Pedido.belongsTo(Cliente, { foreignKey: 'cliente_id', as: 'cliente' });
Cliente.hasMany(Pedido, { foreignKey: 'cliente_id', as: 'pedidos' });

Pedido.belongsTo(Moneda, { foreignKey: 'moneda_id', as: 'moneda' });
Moneda.hasMany(Pedido, { foreignKey: 'moneda_id', as: 'pedidos' });

Pedido.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });
Usuario.hasMany(Pedido, { foreignKey: 'usuario_id', as: 'pedidos' });

Pedido.belongsTo(Empleado, { foreignKey: 'empleado_id', as: 'empleado' });
Empleado.hasMany(Pedido, { foreignKey: 'empleado_id', as: 'pedidos' });

Pedido.belongsTo(Venta, { foreignKey: 'venta_id', as: 'venta' });
Venta.hasMany(Pedido, { foreignKey: 'venta_id', as: 'pedidos' });

export default Pedido;