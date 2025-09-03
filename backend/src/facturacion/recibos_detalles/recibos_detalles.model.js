import db from '../../../database/db.js';
import sequelize from 'sequelize';
import Producto from '../../inventario/productos/productos.model.js';
import Recibo from '../recibos/recibos.model.js';
import Variacion from '../../inventario/variaciones/variaciones.model.js';
import Lote from '../../inventario/lotes/lotes.model.js';

let ReciboDetalle = db.define('recibos_detalles', {
  id: {
    type: sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    validate: { notEmpty: true }
  },
  descripcion: {
    type: sequelize.TEXT
  },
  cantidad: {
    type: sequelize.DECIMAL
  },
  precio_unitario: {
    type: sequelize.DECIMAL
  },
  precio: {
    type: sequelize.DECIMAL,
  },
  descuento: {
    type: sequelize.DECIMAL,
  },
  total: {
    type: sequelize.DECIMAL,
  },
  recibo_id: {
    type: sequelize.INTEGER,
    allowNull: false,
    validate: { notEmpty: true }
  },
}, {
  timestamps: false
});

ReciboDetalle.belongsTo(Recibo, { foreignKey: 'recibo_id', as: 'recibo' });
Recibo.hasMany(ReciboDetalle, { foreignKey: 'recibo_id', as: 'recibos_detalles' });

export default ReciboDetalle;