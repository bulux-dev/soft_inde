import db from '../../../database/db.js';
import sequelize from 'sequelize';
import Categoria from '../categorias/categorias.model.js';
import Marca from '../marcas/marcas.model.js';

let ImporteProducto = db.define('importes_productos', {
  id: {
    type: sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    validate: { notEmpty: true }
  },
  fecha: {
    type: sequelize.STRING
  },
  observaciones: {
    type: sequelize.TEXT
  },
  categoria_id: {
    type: sequelize.INTEGER
  },
  marca_id: {
    type: sequelize.INTEGER
  }
}, {
  timestamps: false
});

ImporteProducto.belongsTo(Categoria, { foreignKey: 'categoria_id', as: 'categoria' });
Categoria.hasMany(ImporteProducto, { foreignKey: 'categoria_id', as: 'importes_productos' });

ImporteProducto.belongsTo(Marca, { foreignKey: 'marca_id', as: 'marca' });
Marca.hasMany(ImporteProducto, { foreignKey: 'marca_id', as: 'importes_productos' });

export default ImporteProducto;