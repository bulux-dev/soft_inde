import db from '../../../database/db.js';
import sequelize from 'sequelize';
import Documento from '../../facturacion/documentos/documentos.model.js';
import Proveedor from '../../personal/proveedores/proveedores.model.js'
import Sucursal from '../../ubicaciones/sucursales/sucursales.model.js';
import Bodega from '../../ubicaciones/bodegas/bodegas.model.js';
import Moneda from '../../facturacion/monedas/monedas.model.js';
import CuentaBancaria from '../cuentas_bancarias/cuentas_bancarias.model.js';
import Usuario from '../../seguridad/usuarios/usuarios.model.js';
import CajaChica from '../cajas_chicas/cajas_chicas.model.js';

let NotaDebito = db.define('notas_debitos', {
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

NotaDebito.belongsTo(Documento, { foreignKey: 'documento_id', as: 'documento' });
Documento.hasMany(NotaDebito, { foreignKey: 'documento_id', as: 'notas_debitos' });

NotaDebito.belongsTo(Sucursal, { foreignKey: 'sucursal_id', as: 'sucursal' });
Sucursal.hasMany(NotaDebito, { foreignKey: 'sucursal_id', as: 'notas_debitos' });

NotaDebito.belongsTo(Bodega, { foreignKey: 'bodega_id', as: 'bodega' });
Bodega.hasMany(NotaDebito, { foreignKey: 'bodega_id', as: 'notas_debitos' });

NotaDebito.belongsTo(Proveedor, { foreignKey: 'proveedor_id', as: 'proveedor' });
Proveedor.hasMany(NotaDebito, { foreignKey: 'proveedor_id', as: 'notas_debitos' });

NotaDebito.belongsTo(Moneda, { foreignKey: 'moneda_id', as: 'moneda' });
Moneda.hasMany(NotaDebito, { foreignKey: 'moneda_id', as: 'notas_debitos' });

NotaDebito.belongsTo(CuentaBancaria, { foreignKey: 'cuenta_bancaria_id', as: 'cuenta_bancaria' });
CuentaBancaria.hasMany(NotaDebito, { foreignKey: 'cuenta_bancaria_id', as: 'notas_debitos' });

NotaDebito.belongsTo(CajaChica, { foreignKey: 'caja_chica_id', as: 'caja_chica' });
CajaChica.hasMany(NotaDebito, { foreignKey: 'caja_chica_id', as: 'notas_debitos' });

NotaDebito.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });
Usuario.hasMany(NotaDebito, { foreignKey: 'usuario_id', as: 'notas_debitos' });

export default NotaDebito;