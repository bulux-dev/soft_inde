import db from '../../../database/db.js';
import sequelize from 'sequelize';
import Producto from '../productos/productos.model.js';
import Lote from '../lotes/lotes.model.js';
import Compra from '../../facturacion/compras/compras.model.js';
import Importacion from '../../facturacion/importaciones/importaciones.model.js';

let ProductoCosto = db.define('productos_costos', {
  id: {
    type: sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    validate: { notEmpty: true }
  },
  stock_inv: {
    type: sequelize.DECIMAL,
  },
  costo_inv: {
    type: sequelize.DECIMAL,
  },
  total_inv: {
    type: sequelize.DECIMAL,
  },
  stock_com: {
    type: sequelize.DECIMAL,
  },
  costo_com: {
    type: sequelize.DECIMAL,
  },
  total_com: {
    type: sequelize.DECIMAL,
  },
  costo_promedio: {
    type: sequelize.DECIMAL,
  },
  producto_id: {
    type: sequelize.INTEGER,
  },
  lote_id: {
    type: sequelize.INTEGER,
  },
  compra_id: {
    type: sequelize.INTEGER,
  },
  importacion_id: {
    type: sequelize.INTEGER,
  },
}, {
  timestamps: false
});

ProductoCosto.belongsTo(Producto, { foreignKey: 'producto_id', as: 'producto' });
Producto.hasMany(ProductoCosto, { foreignKey: 'producto_id', as: 'productos_costos' });

ProductoCosto.belongsTo(Lote, { foreignKey: 'lote_id', as: 'lote' });
Lote.hasMany(ProductoCosto, { foreignKey: 'lote_id', as: 'productos_costos' });

ProductoCosto.belongsTo(Compra, { foreignKey: 'compra_id', as: 'compra' });
Compra.hasMany(ProductoCosto, { foreignKey: 'compra_id', as: 'compras' });

ProductoCosto.belongsTo(Importacion, { foreignKey: 'importacion_id', as: 'importacion' });
Importacion.hasMany(ProductoCosto, { foreignKey: 'importacion_id', as: 'importaciones' });

export default ProductoCosto;