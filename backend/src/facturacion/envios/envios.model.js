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

let Envio = db.define('envios', {
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

Envio.belongsTo(Documento, { foreignKey: 'documento_id', as: 'documento' });
Documento.hasMany(Envio, { foreignKey: 'documento_id', as: 'envios' });

Envio.belongsTo(Sucursal, { foreignKey: 'sucursal_id', as: 'sucursal' });
Sucursal.hasMany(Envio, { foreignKey: 'sucursal_id', as: 'envios' });

Envio.belongsTo(Bodega, { foreignKey: 'bodega_id', as: 'bodega' });
Bodega.hasMany(Envio, { foreignKey: 'bodega_id', as: 'envios' });

Envio.belongsTo(Cliente, { foreignKey: 'cliente_id', as: 'cliente' });
Cliente.hasMany(Envio, { foreignKey: 'cliente_id', as: 'envios' });

Envio.belongsTo(Moneda, { foreignKey: 'moneda_id', as: 'moneda' });
Moneda.hasMany(Envio, { foreignKey: 'moneda_id', as: 'envios' });

Envio.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });
Usuario.hasMany(Envio, { foreignKey: 'usuario_id', as: 'envios' });

Envio.belongsTo(Empleado, { foreignKey: 'empleado_id', as: 'empleado' });
Empleado.hasMany(Envio, { foreignKey: 'empleado_id', as: 'envios' });

Envio.belongsTo(Venta, { foreignKey: 'venta_id', as: 'venta' });
Venta.hasMany(Envio, { foreignKey: 'venta_id', as: 'envios' });

export default Envio;