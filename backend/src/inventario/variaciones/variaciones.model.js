import db from '../../../database/db.js';
import sequelize from 'sequelize';
import Producto from '../productos/productos.model.js';

let Variacion = db.define('variaciones', {
  id: {
    type: sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    validate: { notEmpty: true }
  },
  logo: {
    type: sequelize.TEXT
  },
  sku: {
    type: sequelize.STRING
  },
  nombre: {
    type: sequelize.STRING
  },
  descripcion: {
    type: sequelize.TEXT
  },
  costo: {
    type: sequelize.DECIMAL
  },
  precio: {
    type: sequelize.DECIMAL
  },
  producto_id: {
    type: sequelize.INTEGER
  }
}, {
  timestamps: false
});

Variacion.belongsTo(Producto, { foreignKey: 'producto_id', as: 'producto' });
Producto.hasMany(Variacion, { foreignKey: 'producto_id', as: 'variaciones' });

export default Variacion;