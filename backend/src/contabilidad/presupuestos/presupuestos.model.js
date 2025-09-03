import db from '../../../database/db.js';
import sequelize from 'sequelize';
import CentroCosto from '../centros_costos/centros_costos.model.js';

let Presupuesto = db.define('presupuestos', {
  id: {
    type: sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  numero: {
    type: sequelize.STRING,
    allowNull: false
  },
  nombre: {
    type: sequelize.STRING,
    allowNull: false
  },
  fecha_inicio: {
    type: sequelize.STRING,
    allowNull: false
  },
  fecha_fin: {
    type: sequelize.STRING,
    allowNull: false
  },
  monto: {
    type: sequelize.STRING,
    allowNull: false
  },
  tipo: {
    type: sequelize.STRING,
    allowNull: false
  },
  centro_costo_id: {
    type: sequelize.INTEGER
  },
});

Presupuesto.belongsTo(CentroCosto, { foreignKey: 'centro_costo_id', as: 'centro_costo' });
CentroCosto.hasMany(Presupuesto, { foreignKey: 'centro_costo_id', as: 'presupuestos' });

export default Presupuesto;

