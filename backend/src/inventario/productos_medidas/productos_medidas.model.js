import db from '../../../database/db.js';
import sequelize from 'sequelize';
import Producto from '../productos/productos.model.js';
import Medida from '../medidas/medidas.model.js';

let ProductoMedida = db.define('productos_medidas', {
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
  medida_id: {
    type: sequelize.INTEGER,
  }
}, {
  timestamps: false
});

ProductoMedida.belongsTo(Producto, { foreignKey: 'producto_id', as: 'producto' });
Producto.hasMany(ProductoMedida, { foreignKey: 'producto_id', as: 'productos_medidas'});

ProductoMedida.belongsTo(Medida, { foreignKey: 'medida_id', as: 'medida' });
Medida.hasMany(ProductoMedida, { foreignKey: 'medida_id', as: 'productos_medidas' });

export default ProductoMedida;