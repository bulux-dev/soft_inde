import db from '../../../database/db.js';
import sequelize from 'sequelize';
import Documento from '../../facturacion/documentos/documentos.model.js';
import Cliente from '../../personal/clientes/clientes.model.js'
import Sucursal from '../../ubicaciones/sucursales/sucursales.model.js';
import Bodega from '../../ubicaciones/bodegas/bodegas.model.js';
import Moneda from '../../facturacion/monedas/monedas.model.js';
import CuentaBancaria from '../cuentas_bancarias/cuentas_bancarias.model.js';
import Usuario from '../../seguridad/usuarios/usuarios.model.js';

let NotaCredito = db.define('notas_creditos', {
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
  nombre: {
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
  cuenta_bancaria_id: {
    type: sequelize.INTEGER
  },
  usuario_id: {
    type: sequelize.INTEGER,
    allowNull: false,
    validate: { notEmpty: true }
  }
}, {
  timestamps: false
});

NotaCredito.belongsTo(Documento, { foreignKey: 'documento_id', as: 'documento' });
Documento.hasMany(NotaCredito, { foreignKey: 'documento_id', as: 'notas_creditos' });

NotaCredito.belongsTo(Sucursal, { foreignKey: 'sucursal_id', as: 'sucursal' });
Sucursal.hasMany(NotaCredito, { foreignKey: 'sucursal_id', as: 'notas_creditos' });

NotaCredito.belongsTo(Bodega, { foreignKey: 'bodega_id', as: 'bodega' });
Bodega.hasMany(NotaCredito, { foreignKey: 'bodega_id', as: 'notas_creditos' });

NotaCredito.belongsTo(Cliente, { foreignKey: 'cliente_id', as: 'cliente' });
Cliente.hasMany(NotaCredito, { foreignKey: 'cliente_id', as: 'notas_creditos' });

NotaCredito.belongsTo(Moneda, { foreignKey: 'moneda_id', as: 'moneda' });
Moneda.hasMany(NotaCredito, { foreignKey: 'moneda_id', as: 'notas_creditos' });

NotaCredito.belongsTo(CuentaBancaria, { foreignKey: 'cuenta_bancaria_id', as: 'cuenta_bancaria' });
CuentaBancaria.hasMany(NotaCredito, { foreignKey: 'cuenta_bancaria_id', as: 'notas_creditos' });

NotaCredito.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });
Usuario.hasMany(NotaCredito, { foreignKey: 'usuario_id', as: 'notas_creditos' });

export default NotaCredito;