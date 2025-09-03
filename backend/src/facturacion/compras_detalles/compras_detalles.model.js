import db from '../../../database/db.js';
import sequelize from 'sequelize';
import Producto from '../../inventario/productos/productos.model.js';
import Compra from '../compras/compras.model.js';
import Variacion from '../../inventario/variaciones/variaciones.model.js';
import Lote from '../../inventario/lotes/lotes.model.js';
import Medida from '../../inventario/medidas/medidas.model.js';

let CompraDetalle = db.define('compras_detalles', {
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
    type: sequelize.DECIMAL,
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
  compra_id: {
    type: sequelize.INTEGER,
    allowNull: false,
    validate: { notEmpty: true }
  },
}, {
  timestamps: false
});

CompraDetalle.belongsTo(Producto, { foreignKey: 'producto_id', as: 'producto' });
Producto.hasMany(CompraDetalle, { foreignKey: 'producto_id', as: 'compras_detalles' });

CompraDetalle.belongsTo(Medida, { foreignKey: 'medida_id', as: 'medida' });
Medida.hasMany(CompraDetalle, { foreignKey: 'medida_id', as: 'compras_detalles' });

CompraDetalle.belongsTo(Variacion, { foreignKey: 'variacion_id', as: 'variacion' });
Variacion.hasMany(CompraDetalle, { foreignKey: 'variacion_id', as: 'compras_detalles' });

CompraDetalle.belongsTo(Lote, { foreignKey: 'lote_id', as: 'lote' });
Lote.hasMany(CompraDetalle, { foreignKey: 'lote_id', as: 'compras_detalles' });

CompraDetalle.belongsTo(Compra, { foreignKey: 'compra_id', as: 'compra' });
Compra.hasMany(CompraDetalle, { foreignKey: 'compra_id', as: 'compras_detalles' });

export default CompraDetalle;