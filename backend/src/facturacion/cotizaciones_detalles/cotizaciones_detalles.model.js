import db from '../../../database/db.js';
import sequelize from 'sequelize';
import Producto from '../../inventario/productos/productos.model.js';
import Cotizacion from '../cotizaciones/cotizaciones.model.js';
import Variacion from '../../inventario/variaciones/variaciones.model.js';
import Lote from '../../inventario/lotes/lotes.model.js';
import Medida from '../../inventario/medidas/medidas.model.js';

let CotizacionDetalle = db.define('cotizaciones_detalles', {
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
  cotizacion_id: {
    type: sequelize.INTEGER,
    allowNull: false,
    validate: { notEmpty: true }
  },

}, {
  timestamps: false
});

CotizacionDetalle.belongsTo(Producto, { foreignKey: 'producto_id', as: 'producto' });
Producto.hasMany(CotizacionDetalle, { foreignKey: 'producto_id', as: 'cotizaciones_detalles' });

CotizacionDetalle.belongsTo(Medida, { foreignKey: 'medida_id', as: 'medida' });
Medida.hasMany(CotizacionDetalle, { foreignKey: 'medida_id', as: 'cotizaciones_detalles' });

CotizacionDetalle.belongsTo(Variacion, { foreignKey: 'variacion_id', as: 'variacion' });
Variacion.hasMany(CotizacionDetalle, { foreignKey: 'variacion_id', as: 'cotizaciones_detalles' });

CotizacionDetalle.belongsTo(Lote, { foreignKey: 'lote_id', as: 'lote' });
Lote.hasMany(CotizacionDetalle, { foreignKey: 'lote_id', as: 'cotizaciones_detalles' });

CotizacionDetalle.belongsTo(Cotizacion, { foreignKey: 'cotizacion_id', as: 'cotizacion' });
Cotizacion.hasMany(CotizacionDetalle, { foreignKey: 'cotizacion_id', as: 'cotizaciones_detalles' });

export default CotizacionDetalle;