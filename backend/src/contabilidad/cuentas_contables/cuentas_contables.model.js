import db from '../../../database/db.js';
import sequelize from 'sequelize';

let CuentaContable = db.define('cuentas_contables', {
  id: {
    type: sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    validate: { notEmpty: true }
  },
  numero: {
    type: sequelize.STRING
  },
  nombre: {
    type: sequelize.STRING,
    allowNull: false,
    validate: { notEmpty: true }
  },
  nivel: {
    type: sequelize.STRING
  },
  tipo: {
    type: sequelize.STRING
  },
  flujo: {
    type: sequelize.STRING
  },
  origen: {
    type: sequelize.STRING
  },
  cuenta_contable_id: {
    type: sequelize.INTEGER
  },
});

CuentaContable.belongsTo(CuentaContable, { foreignKey: 'cuenta_contable_id', as: 'cuenta_contable_padre' });
CuentaContable.hasMany(CuentaContable, { foreignKey: 'cuenta_contable_id', as: 'cuentas_contables_hijas' });

export default CuentaContable;