import db from '../../../database/db.js';
import sequelize from 'sequelize';
import Medida from '../medidas/medidas.model.js';
import Producto from '../productos/productos.model.js';

let Equivalencia = db.define('equivalencias', {
  id: {
    type: sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    validate: { notEmpty: true }
  },
  equivalencia: {
    type: sequelize.STRING,
  },
  tipo: {
    type: sequelize.STRING,
  },
  producto_id: {
    type: sequelize.INTEGER
  },
  medida_id: {
    type: sequelize.INTEGER
  }
}, {
  timestamps: false
});

Equivalencia.belongsTo(Producto, { foreignKey: 'producto_id', as: 'producto' });
Producto.hasMany(Equivalencia, { foreignKey: 'producto_id', as: 'equivalencias' });

Equivalencia.belongsTo(Medida, { foreignKey: 'medida_id', as: 'medida' });
Medida.hasMany(Equivalencia, { foreignKey: 'medida_id', as: 'equivalencias' });

export default Equivalencia;