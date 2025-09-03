import db from '../../../database/db.js';
import sequelize from 'sequelize';
import Documento from '../../facturacion/documentos/documentos.model.js';
import Cliente from '../../personal/clientes/clientes.model.js';
import Sucursal from '../../ubicaciones/sucursales/sucursales.model.js';
import Bodega from '../../ubicaciones/bodegas/bodegas.model.js';
import Moneda from '../monedas/monedas.model.js';
import Usuario from '../../seguridad/usuarios/usuarios.model.js';

let NCCliente = db.define('nc_clientes', {
  id: {
    type: sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    validate: { notEmpty: true }
  },
  no_nc: {
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
  usuario_id: {
    type: sequelize.INTEGER,
    allowNull: false,
    validate: { notEmpty: true }
  }
}, {
  timestamps: false
});

NCCliente.belongsTo(Documento, { foreignKey: 'documento_id', as: 'documento' });
Documento.hasMany(NCCliente, { foreignKey: 'documento_id', as: 'nc_clientes' });

NCCliente.belongsTo(Sucursal, { foreignKey: 'sucursal_id', as: 'sucursal' });
Sucursal.hasMany(NCCliente, { foreignKey: 'sucursal_id', as: 'nc_clientes' });

NCCliente.belongsTo(Bodega, { foreignKey: 'bodega_id', as: 'bodega' });
Bodega.hasMany(NCCliente, { foreignKey: 'bodega_id', as: 'nc_clientes' });

NCCliente.belongsTo(Cliente, { foreignKey: 'cliente_id', as: 'cliente' });
Cliente.hasMany(NCCliente, { foreignKey: 'cliente_id', as: 'nc_clientes' });

NCCliente.belongsTo(Moneda, { foreignKey: 'moneda_id', as: 'moneda' });
Moneda.hasMany(NCCliente, { foreignKey: 'moneda_id', as: 'nc_clientes' });

NCCliente.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });
Usuario.hasMany(NCCliente, { foreignKey: 'usuario_id', as: 'nc_clientes' });

export default NCCliente;