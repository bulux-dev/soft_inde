import db from '../../../database/db.js';
import sequelize from 'sequelize';
import Compra from '../compras/compras.model.js';
import Venta from '../ventas/ventas.model.js';
import Recibo from '../recibos/recibos.model.js';
import Importacion from '../importaciones/importaciones.model.js';
import Proveedor from '../../personal/proveedores/proveedores.model.js';

let Pago = db.define('pagos', {
  id: {
    type: sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    validate: { notEmpty: true }
  },
  monto: {
    type: sequelize.DECIMAL
  },
  cambio: {
    type: sequelize.DECIMAL
  },
  metodo: {
    type: sequelize.STRING
  },
  fecha: {
    type: sequelize.STRING
  },
  autorizacion: {
    type: sequelize.STRING
  },
  compra_id: {
    type: sequelize.INTEGER
  },
  venta_id: {
    type: sequelize.INTEGER
  },
  recibo_id: {
    type: sequelize.INTEGER
  },
  importacion_id: {
    type: sequelize.INTEGER
  },
  tarjeta_id: {
    type: sequelize.INTEGER
  }
}, {
  timestamps: false
});

Pago.belongsTo(Compra, { foreignKey: 'compra_id', as: 'compra' });
Compra.hasMany(Pago, { foreignKey: 'compra_id', as: 'pagos' });

Pago.belongsTo(Venta, { foreignKey: 'venta_id', as: 'venta' });
Venta.hasMany(Pago, { foreignKey: 'venta_id', as: 'pagos' });

Pago.belongsTo(Recibo, { foreignKey: 'recibo_id', as: 'recibo' });
Recibo.hasMany(Pago, { foreignKey: 'recibo_id', as: 'pagos' });

Pago.belongsTo(Importacion, { foreignKey: 'importacion_id', as: 'importacion' });
Importacion.hasMany(Pago, { foreignKey: 'importacion_id', as: 'pagos' });

Pago.belongsTo(Proveedor, { foreignKey: 'tarjeta_id', as: 'tarjeta' });
Proveedor.hasMany(Pago, { foreignKey: 'tarjeta_id', as: 'pagos' });

export default Pago;