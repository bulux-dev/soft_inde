import db from '../../../database/db.js';
import sequelize from 'sequelize';
import Documento from '../documentos/documentos.model.js';
import Cliente from '../../personal/clientes/clientes.model.js';
import Sucursal from '../../ubicaciones/sucursales/sucursales.model.js';
import Bodega from '../../ubicaciones/bodegas/bodegas.model.js';
import Moneda from '../monedas/monedas.model.js';
import Usuario from '../../seguridad/usuarios/usuarios.model.js';
import Deposito from '../../finanzas/depositos/depositos.model.js';
import NotaCredito from '../../finanzas/notas_creditos/notas_creditos.model.js';

let Recibo = db.define('recibos', {
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
  usuario_id: {
    type: sequelize.INTEGER,
    allowNull: false,
    validate: { notEmpty: true }
  },
  deposito_id: {
    type: sequelize.INTEGER
  },
  nota_credito_id: {
    type: sequelize.INTEGER
  }
}, {
  timestamps: false
});

Recibo.belongsTo(Documento, { foreignKey: 'documento_id', as: 'documento' });
Documento.hasMany(Recibo, { foreignKey: 'documento_id', as: 'recibos' });

Recibo.belongsTo(Sucursal, { foreignKey: 'sucursal_id', as: 'sucursal' });
Sucursal.hasMany(Recibo, { foreignKey: 'sucursal_id', as: 'recibos' });

Recibo.belongsTo(Bodega, { foreignKey: 'bodega_id', as: 'bodega' });
Bodega.hasMany(Recibo, { foreignKey: 'bodega_id', as: 'recibos' });

Recibo.belongsTo(Cliente, { foreignKey: 'cliente_id', as: 'cliente' });
Cliente.hasMany(Recibo, { foreignKey: 'cliente_id', as: 'recibos' });

Recibo.belongsTo(Moneda, { foreignKey: 'moneda_id', as: 'moneda' });
Moneda.hasMany(Recibo, { foreignKey: 'moneda_id', as: 'recibos' });

Recibo.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });
Usuario.hasMany(Recibo, { foreignKey: 'usuario_id', as: 'recibos' });

Recibo.belongsTo(Deposito, { foreignKey: 'deposito_id', as: 'deposito' });
Deposito.hasMany(Recibo, { foreignKey: 'deposito_id', as: 'recibos' });

Recibo.belongsTo(NotaCredito, { foreignKey: 'nota_credito_id', as: 'nota_credito' });
NotaCredito.hasMany(Recibo, { foreignKey: 'nota_credito_id', as: 'recibos' });

export default Recibo;