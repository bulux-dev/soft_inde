import db from '../../../database/db.js';
import sequelize from 'sequelize';
import Producto from '../productos/productos.model.js';
import Categoria from '../categorias/categorias.model.js';

let ProductoCategoria = db.define('productos_categorias', {
  id: {
    type: sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    validate: { notEmpty: true }
  },
  producto_id: {
    type: sequelize.INTEGER,
  },
  categoria_id: {
    type: sequelize.INTEGER,
  }
}, {
  timestamps: false
});

ProductoCategoria.belongsTo(Producto, { foreignKey: 'producto_id', as: 'producto' });
Producto.hasMany(ProductoCategoria, { foreignKey: 'producto_id', as: 'productos_categorias' });

ProductoCategoria.belongsTo(Categoria, { foreignKey: 'categoria_id', as: 'categoria' });
Categoria.hasMany(ProductoCategoria, { foreignKey: 'categoria_id', as: 'productos_categorias' });

export default ProductoCategoria;