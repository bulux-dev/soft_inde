import db from '../../../database/db.js';
import sequelize from 'sequelize';
import Compra from '../compras/compras.model.js';
import Venta from '../ventas/ventas.model.js';
import Recibo from '../recibos/recibos.model.js';
import Cheque from '../../finanzas/cheques/cheques.model.js';
import Deposito from '../../finanzas/depositos/depositos.model.js';
import NotaDebito from '../../finanzas/notas_debitos/notas_debitos.model.js';
import NotaCredito from '../../finanzas/notas_creditos/notas_creditos.model.js';
import NCCliente from '../../facturacion/nc_clientes/nc_clientes.model.js';
import NDCliente from '../../facturacion/nd_clientes/nd_clientes.model.js';
import NCProveedor from '../../facturacion/nc_proveedores/nc_proveedores.model.js'
import NDProveedor from '../../facturacion/nd_proveedores/nd_proveedores.model.js';
import Cliente from '../../personal/clientes/clientes.model.js';
import Proveedor from '../../personal/proveedores/proveedores.model.js';
import Importacion from '../importaciones/importaciones.model.js';

let Saldo = db.define('saldos', {
  id: {
    type: sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    validate: { notEmpty: true }
  },
  saldo_inicial: {
    type: sequelize.DECIMAL
  },
  tipo: {
    type: sequelize.STRING
  },
  total: {
    type: sequelize.DECIMAL
  },
  saldo_final: {
    type: sequelize.DECIMAL
  },
  saldo_acumulado: {
    type: sequelize.DECIMAL
  },
  estado: {
    type: sequelize.STRING
  },
  cliente_id: {
    type: sequelize.INTEGER
  },
  proveedor_id: {
    type: sequelize.INTEGER
  },
  venta_id: {
    type: sequelize.INTEGER
  },
  compra_id: {
    type: sequelize.INTEGER
  },
  recibo_id: {
    type: sequelize.INTEGER
  },
  cheque_id: {
    type: sequelize.INTEGER
  },
  deposito_id: {
    type: sequelize.INTEGER
  },
  nota_debito_id: {
    type: sequelize.INTEGER
  },
  nota_credito_id: {
    type: sequelize.INTEGER
  },
  nc_cliente_id: {
    type: sequelize.INTEGER
  },
  nd_cliente_id: {
    type: sequelize.INTEGER
  },
  nc_proveedor_id: {
    type: sequelize.INTEGER
  },
  nd_proveedor_id: {
    type: sequelize.INTEGER
  },
  importacion_id: {
    type: sequelize.INTEGER
  }
}, {
  timestamps: false
});

Saldo.belongsTo(Cliente, { foreignKey: 'cliente_id', as: 'cliente' });
Cliente.hasMany(Saldo, { foreignKey: 'cliente_id', as: 'saldos' });

Saldo.belongsTo(Proveedor, { foreignKey: 'proveedor_id', as: 'proveedor' });
Proveedor.hasMany(Saldo, { foreignKey: 'proveedor_id', as: 'saldos' });

Saldo.belongsTo(Compra, { foreignKey: 'compra_id', as: 'compra' });
Compra.hasMany(Saldo, { foreignKey: 'compra_id', as: 'saldos' });

Saldo.belongsTo(Venta, { foreignKey: 'venta_id', as: 'venta' });
Venta.hasMany(Saldo, { foreignKey: 'venta_id', as: 'saldos' });

Saldo.belongsTo(Recibo, { foreignKey: 'recibo_id', as: 'recibo' });
Recibo.hasMany(Saldo, { foreignKey: 'recibo_id', as: 'saldos' });

Saldo.belongsTo(Cheque, { foreignKey: 'cheque_id', as: 'cheque' });
Cheque.hasMany(Saldo, { foreignKey: 'cheque_id', as: 'saldos' });

Saldo.belongsTo(Deposito, { foreignKey: 'deposito_id', as: 'deposito' });
Deposito.hasMany(Saldo, { foreignKey: 'deposito_id', as: 'saldos' });

Saldo.belongsTo(NotaDebito, { foreignKey: 'nota_debito_id', as: 'nota_debito' });
NotaDebito.hasMany(Saldo, { foreignKey: 'nota_debito_id', as: 'saldos' });

Saldo.belongsTo(NotaCredito, { foreignKey: 'nota_credito_id', as: 'nota_credito' });
NotaCredito.hasMany(Saldo, { foreignKey: 'nota_credito_id', as: 'saldos' });

Saldo.belongsTo(NCCliente, { foreignKey: 'nc_cliente_id', as: 'nc_cliente' });
NCCliente.hasMany(Saldo, { foreignKey: 'nc_cliente_id', as: 'saldos' });

Saldo.belongsTo(NDCliente, { foreignKey: 'nd_cliente_id', as: 'nd_cliente' });
NDCliente.hasMany(Saldo, { foreignKey: 'nd_cliente_id', as: 'saldos' });

Saldo.belongsTo(NCProveedor, { foreignKey: 'nc_proveedor_id', as: 'nc_proveedor' });
NCProveedor.hasMany(Saldo, { foreignKey: 'nc_proveedor_id', as: 'saldos' });

Saldo.belongsTo(NDProveedor, { foreignKey: 'nd_proveedor_id', as: 'nd_proveedor' });
NDProveedor.hasMany(Saldo, { foreignKey: 'nd_proveedor_id', as: 'saldos' });

Saldo.belongsTo(Importacion, { foreignKey: 'importacion_id', as: 'importacion' });
Importacion.hasMany(Saldo, { foreignKey: 'importacion_id', as: 'saldos' });

export default Saldo;