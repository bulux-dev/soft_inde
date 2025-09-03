import db from '../../../database/db.js';
import sequelize from 'sequelize';
import Producto from '../../inventario/productos/productos.model.js';
import OrdenCompra from '../ordenes_compras/ordenes_compras.model.js';
import Variacion from '../../inventario/variaciones/variaciones.model.js';
import Lote from '../../inventario/lotes/lotes.model.js';
import Medida from '../../inventario/medidas/medidas.model.js';

let OrdenCompraDetalle = db.define('ordenes_compras_detalles', {
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
  costo_unitario: {
    type: sequelize.DECIMAL
  },
  costo: {
    type: sequelize.DECIMAL,
  },
  descuento: {
    type: sequelize.DECIMAL,
  },
  total: {
    type: sequelize.DECIMAL,
  },
  subtotal: {
    type: sequelize.DECIMAL,
  },
  impuesto: {
    type: sequelize.DECIMAL,
  },
  costo_unitario_ext: {
    type: sequelize.DECIMAL
  },
  costo_ext: {
    type: sequelize.DECIMAL,
  },
  descuento_ext: {
    type: sequelize.DECIMAL,
  },
  total_ext: {
    type: sequelize.DECIMAL,
  },
  subtotal_ext: {
    type: sequelize.DECIMAL,
  },
  impuesto_ext: {
    type: sequelize.DECIMAL,
  },
  equivalencia: {
    type: sequelize.DECIMAL
  },
  producto_id: {
    type: sequelize.INTEGER,
    allowNull: false,
    validate: { notEmpty: true }
  },
  medida_id: {
    type: sequelize.INTEGER
  },
  lote_id: {
    type: sequelize.INTEGER
  },
  variacion_id: {
    type: sequelize.INTEGER
  },
  orden_compra_id: {
    type: sequelize.INTEGER,
    allowNull: false,
    validate: { notEmpty: true }
  },
}, {
  timestamps: false
});

OrdenCompraDetalle.belongsTo(Producto, { foreignKey: 'producto_id', as: 'producto' });
Producto.hasMany(OrdenCompraDetalle, { foreignKey: 'producto_id', as: 'ordenes_compras_detalles' });

OrdenCompraDetalle.belongsTo(Medida, { foreignKey: 'medida_id', as: 'medida' });
Medida.hasMany(OrdenCompraDetalle, { foreignKey: 'medida_id', as: 'ordenes_compras_detalles' });

OrdenCompraDetalle.belongsTo(Variacion, { foreignKey: 'variacion_id', as: 'variacion' });
Variacion.hasMany(OrdenCompraDetalle, { foreignKey: 'variacion_id', as: 'ordenes_compras_detalles' });

OrdenCompraDetalle.belongsTo(Lote, { foreignKey: 'lote_id', as: 'lote' });
Lote.hasMany(OrdenCompraDetalle, { foreignKey: 'lote_id', as: 'ordenes_compras_detalles' });

OrdenCompraDetalle.belongsTo(OrdenCompra, { foreignKey: 'orden_compra_id', as: 'orden_compra' });
OrdenCompra.hasMany(OrdenCompraDetalle, { foreignKey: 'orden_compra_id', as: 'ordenes_compras_detalles' });

export default OrdenCompraDetalle;