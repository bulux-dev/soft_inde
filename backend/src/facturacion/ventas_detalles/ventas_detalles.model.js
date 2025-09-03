import db from '../../../database/db.js';
import sequelize from 'sequelize';
import Producto from '../../inventario/productos/productos.model.js';
import Venta from '../ventas/ventas.model.js';
import Variacion from '../../inventario/variaciones/variaciones.model.js';
import Lote from '../../inventario/lotes/lotes.model.js';
import Medida from '../../inventario/medidas/medidas.model.js';

let VentaDetalle = db.define('ventas_detalles', {
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
  subtotal: {
    type: sequelize.DECIMAL,
  },
  impuesto: {
    type: sequelize.DECIMAL,
  },
  precio_unitario_ext: {
    type: sequelize.DECIMAL
  },
  precio_ext: {
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
    type: sequelize.DECIMAL,
  },
  producto_id: {
    type: sequelize.DECIMAL,
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
  venta_id: {
    type: sequelize.INTEGER,
    allowNull: false,
    validate: { notEmpty: true }
  },

}, {
  timestamps: false
});

VentaDetalle.belongsTo(Producto, { foreignKey: 'producto_id', as: 'producto' });
Producto.hasMany(VentaDetalle, { foreignKey: 'producto_id', as: 'ventas_detalles' });

VentaDetalle.belongsTo(Medida, { foreignKey: 'medida_id', as: 'medida' });
Medida.hasMany(VentaDetalle, { foreignKey: 'medida_id', as: 'ventas_detalles' });

VentaDetalle.belongsTo(Variacion, { foreignKey: 'variacion_id', as: 'variacion' });
Variacion.hasMany(VentaDetalle, { foreignKey: 'variacion_id', as: 'ventas_detalles' });

VentaDetalle.belongsTo(Lote, { foreignKey: 'lote_id', as: 'lote' });
Lote.hasMany(VentaDetalle, { foreignKey: 'lote_id', as: 'ventas_detalles' });

VentaDetalle.belongsTo(Venta, { foreignKey: 'venta_id', as: 'venta' });
Venta.hasMany(VentaDetalle, { foreignKey: 'venta_id', as: 'ventas_detalles' });

export default VentaDetalle;