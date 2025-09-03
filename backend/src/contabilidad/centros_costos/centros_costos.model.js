import db from '../../../database/db.js';
import sequelize from 'sequelize';

let CentroCosto = db.define('centros_costos', {
  id: {
    type: sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    validate: { noEmpty: true },
  },
  numero: {
    type: sequelize.INTEGER,
    allowNull: false,
  },
  nombre: {
    type: sequelize.STRING,
    allowNull: false,
  },
  nivel: {
    type: sequelize.STRING,
    allowNull: false,
  },
  tipo: {
    type: sequelize.STRING,
    allowNull: false,
  },
  centro_costo_id: {
    type: sequelize.INTEGER,
  },
});

CentroCosto.belongsTo(CentroCosto, { foreignKey: 'centro_costo_id', as: 'centro_costo_padre' });
CentroCosto.hasMany(CentroCosto, { foreignKey: 'centro_costo_id', as: 'centros_costos_hijas' });

export default CentroCosto;
