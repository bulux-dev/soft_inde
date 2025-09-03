import db from '../../../database/db.js';
import sequelize from 'sequelize';
import Producto from '../productos/productos.model.js';
import Atributo from '../atributos/atributos.model.js';

let ProductoAtributo = db.define('productos_atributos', {
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
  atributo_id: {
    type: sequelize.INTEGER,
  }
}, {
  timestamps: false
});

ProductoAtributo.belongsTo(Producto, { foreignKey: 'producto_id', as: 'producto' });
Producto.hasMany(ProductoAtributo, { foreignKey: 'producto_id', as: 'productos_atributos' });

ProductoAtributo.belongsTo(Atributo, { foreignKey: 'atributo_id', as: 'atributo' });
Atributo.hasMany(ProductoAtributo, { foreignKey: 'atributo_id', as: 'productos_atributos' });

export default ProductoAtributo;