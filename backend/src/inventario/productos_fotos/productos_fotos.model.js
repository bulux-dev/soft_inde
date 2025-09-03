import db from '../../../database/db.js';
import sequelize from 'sequelize';
import Producto from '../productos/productos.model.js';

let ProductoFoto = db.define('productos_fotos', {
  id: {
    type: sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    validate: { notEmpty: true }
  },
  foto: {
    type: sequelize.TEXT,
  },
  producto_id: {
    type: sequelize.INTEGER,
  }
}, {
  timestamps: false
});

ProductoFoto.belongsTo(Producto, { foreignKey: 'producto_id', as: 'producto' });
Producto.hasMany(ProductoFoto, { foreignKey: 'producto_id', as: 'productos_fotos' });

export default ProductoFoto;