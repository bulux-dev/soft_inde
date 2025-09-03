import db from '../../../database/db.js';
import sequelize from 'sequelize';

let ProductoPrecio = db.define('productos_precios', {
  id: {
    type: sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    validate: { notEmpty: true }
  },
  nombre: {
    type: sequelize.STRING,
  },
  tipo: {
    type: sequelize.STRING,
  },
  valor: {
    type: sequelize.DECIMAL,
  }
}, {
  timestamps: false
});

export default ProductoPrecio;