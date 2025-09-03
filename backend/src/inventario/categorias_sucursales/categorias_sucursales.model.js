import db from '../../../database/db.js';
import sequelize from 'sequelize';
import Categoria from '../categorias/categorias.model.js';
import Sucursal from '../../ubicaciones/sucursales/sucursales.model.js';

let CategoriaSucursal = db.define('categorias_sucursales', {
  id: {
    type: sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    validate: { notEmpty: true }
  },
  sucursal_id: {
    type: sequelize.INTEGER,
  },
  categoria_id: {
    type: sequelize.INTEGER,
  }
}, {
  timestamps: false
});

CategoriaSucursal.belongsTo(Sucursal, { foreignKey: 'sucursal_id', as: 'sucursal' });
Sucursal.hasMany(CategoriaSucursal, { foreignKey: 'sucursal_id', as: 'categorias_sucursales' });

CategoriaSucursal.belongsTo(Categoria, { foreignKey: 'categoria_id', as: 'categoria' });
Categoria.hasMany(CategoriaSucursal, { foreignKey: 'categoria_id', as: 'categorias_sucursales' });

export default CategoriaSucursal;