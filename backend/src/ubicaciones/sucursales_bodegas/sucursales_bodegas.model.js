import db from '../../../database/db.js';
import sequelize from 'sequelize';
import Sucursal from '../sucursales/sucursales.model.js';
import Bodega from '../bodegas/bodegas.model.js';

let SucursalBodega = db.define('sucursales_bodegas', {
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
  bodega_id: {
    type: sequelize.INTEGER,
  }
}, {
  timestamps: false
});

SucursalBodega.belongsTo(Sucursal, { foreignKey: 'sucursal_id', as: 'sucursal' });
Sucursal.hasMany(SucursalBodega, { foreignKey: 'sucursal_id', as: 'sucursales_bodegas' });

SucursalBodega.belongsTo(Bodega, { foreignKey: 'bodega_id', as: 'bodega' });
Bodega.hasMany(SucursalBodega, { foreignKey: 'bodega_id', as: 'sucursales_bodegas' });

export default SucursalBodega;