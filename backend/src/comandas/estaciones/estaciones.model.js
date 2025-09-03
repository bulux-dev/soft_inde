import db from '../../../database/db.js';
import sequelize from 'sequelize';
import Area from '../areas/areas.model.js';

let Estacion = db.define('estaciones', {
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
  area_id: {
    type: sequelize.INTEGER
  }
}, {
  timestamps: false
});

Estacion.belongsTo(Area, { foreignKey: 'area_id', as: 'area' });
Area.hasMany(Estacion, { foreignKey: 'area_id', as: 'estaciones' });

export default Estacion;