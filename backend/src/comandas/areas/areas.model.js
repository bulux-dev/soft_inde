import db from '../../../database/db.js';
import sequelize from 'sequelize';
import Comercio from '../comercios/comercios.model.js';

let Area = db.define('areas', {
  id: {
    type: sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    validate: { notEmpty: true }
  },
  nombre: {
    type: sequelize.STRING,
    allowNull: false,
    validate: { notEmpty: true }
  },
  comercio_id: {
    type: sequelize.INTEGER
  }
}, {
  timestamps: false
});

Area.belongsTo(Comercio, { foreignKey: 'comercio_id', as: 'comercio' });
Comercio.hasMany(Area, { foreignKey: 'comercio_id', as: 'areas' });

export default Area;