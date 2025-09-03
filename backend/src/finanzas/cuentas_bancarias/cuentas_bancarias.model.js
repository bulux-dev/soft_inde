import db from '../../../database/db.js';
import sequelize from 'sequelize';
import Banco from '../bancos/bancos.model.js';

let CuentaBancaria = db.define('cuentas_bancarias', {
  id: {
    type: sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    validate: { notEmpty: true }
  },
  nombre: {
    type: sequelize.STRING,
  },
  no_cuenta: {
    type: sequelize.STRING,
  },
  tipo: {
    type: sequelize.STRING,
  },
  banco_id: {
    type: sequelize.INTEGER,
  }
}, {
  timestamps: false
});

CuentaBancaria.belongsTo(Banco, { foreignKey: 'banco_id', as: 'banco' });
Banco.hasMany(CuentaBancaria, { foreignKey: 'banco_id', as: 'cuentas_bancarias' });

export default CuentaBancaria;