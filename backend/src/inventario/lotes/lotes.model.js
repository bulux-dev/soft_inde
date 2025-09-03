import db from '../../../database/db.js';
import sequelize from 'sequelize';
import Producto from '../productos/productos.model.js';

let Lote = db.define('lotes', {
  id: {
    type: sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    validate: { notEmpty: true }
  },
  nombre: {
    type: sequelize.STRING
  },
  costo: {
    type: sequelize.DECIMAL
  },
  fecha_alta: {
    type: sequelize.STRING
  },
  fecha_caducidad: {
    type: sequelize.STRING
  },
  producto_id: {
    type: sequelize.INTEGER
  }
}, {
  timestamps: false
});

Lote.belongsTo(Producto, { foreignKey: 'producto_id', as: 'producto' });
Producto.hasMany(Lote, { foreignKey: 'producto_id', as: 'lotes' });

export default Lote;