import db from '../../../database/db.js';
import sequelize from 'sequelize';
import Documento from '../../facturacion/documentos/documentos.model.js';
import Proveedor from '../../personal/proveedores/proveedores.model.js'
import Sucursal from '../../ubicaciones/sucursales/sucursales.model.js';
import Bodega from '../../ubicaciones/bodegas/bodegas.model.js';
import Moneda from '../../facturacion/monedas/monedas.model.js';
import CuentaBancaria from '../cuentas_bancarias/cuentas_bancarias.model.js';
import CajaChica from '../cajas_chicas/cajas_chicas.model.js';
import Usuario from '../../seguridad/usuarios/usuarios.model.js';

let Cheque = db.define('cheques', {
  id: {
    type: sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    validate: { notEmpty: true }
  },
  no_cheque: {
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
  cuenta_bancaria_id: {
    type: sequelize.INTEGER
  },
  caja_chica_id: {
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

Cheque.belongsTo(Documento, { foreignKey: 'documento_id', as: 'documento' });
Documento.hasMany(Cheque, { foreignKey: 'documento_id', as: 'cheques' });

Cheque.belongsTo(Sucursal, { foreignKey: 'sucursal_id', as: 'sucursal' });
Sucursal.hasMany(Cheque, { foreignKey: 'sucursal_id', as: 'cheques' });

Cheque.belongsTo(Bodega, { foreignKey: 'bodega_id', as: 'bodega' });
Bodega.hasMany(Cheque, { foreignKey: 'bodega_id', as: 'cheques' });

Cheque.belongsTo(Proveedor, { foreignKey: 'proveedor_id', as: 'proveedor' });
Proveedor.hasMany(Cheque, { foreignKey: 'proveedor_id', as: 'cheques' });

Cheque.belongsTo(Moneda, { foreignKey: 'moneda_id', as: 'moneda' });
Moneda.hasMany(Cheque, { foreignKey: 'moneda_id', as: 'cheques' });

Cheque.belongsTo(CuentaBancaria, { foreignKey: 'cuenta_bancaria_id', as: 'cuenta_bancaria' });
CuentaBancaria.hasMany(Cheque, { foreignKey: 'cuenta_bancaria_id', as: 'cheques' });

Cheque.belongsTo(CajaChica, { foreignKey: 'caja_chica_id', as: 'caja_chica' });
CajaChica.hasMany(Cheque, { foreignKey: 'caja_chica_id', as: 'cheques' });

Cheque.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });
Usuario.hasMany(Cheque, { foreignKey: 'usuario_id', as: 'cheques' });

export default Cheque;