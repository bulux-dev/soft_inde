import db from '../../../database/db.js';
import sequelize from 'sequelize';
import Compra from '../compras/compras.model.js';
import Venta from '../ventas/ventas.model.js';
import Recibo from '../recibos/recibos.model.js';

let Abono = db.define('abonos', {
  id: {
    type: sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    validate: { notEmpty: true }
  },
  fecha: {
    type: sequelize.STRING
  },
  monto: {
    type: sequelize.DECIMAL
  },
  venta_id: {
    type: sequelize.INTEGER
  }
}, {
  timestamps: false
});

Abono.belongsTo(Venta, { foreignKey: 'venta_id', as: 'venta' });
Venta.hasMany(Abono, { foreignKey: 'venta_id', as: 'abonos' });

export default Abono;