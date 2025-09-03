import db from '../../../database/db.js';
import sequelize from 'sequelize';
import Producto from '../productos/productos.model.js';
import Marca from '../marcas/marcas.model.js';

let ProductoMarca = db.define('productos_marcas', {
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
  marca_id: {
    type: sequelize.INTEGER,
  }
}, {
  timestamps: false
});

ProductoMarca.belongsTo(Producto, { foreignKey: 'producto_id', as: 'producto' });
Producto.hasMany(ProductoMarca, { foreignKey: 'producto_id', as: 'productos_marcas' });

ProductoMarca.belongsTo(Marca, { foreignKey: 'marca_id', as: 'marca' });
Marca.hasMany(ProductoMarca, { foreignKey: 'marca_id', as: 'productos_marcas' });

export default ProductoMarca;