import db from '../../../database/db.js';
import sequelize from 'sequelize';
import Credito from '../creditos/creditos.model.js';

let Cuota = db.define('cuotas', {
  id: {
    type: sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    validate: { notEmpty: true }
  },
  numero: {
    type: sequelize.INTEGER,
    allowNull: false,
    validate: { notEmpty: true }
  },
  fecha_inicio: {
    type: sequelize.STRING
  },
  fecha_fin: {
    type: sequelize.STRING
  },
  dias: {
    type: sequelize.STRING
  },
  saldo_inicial: {
    type: sequelize.DECIMAL
  },
  capital: {
    type: sequelize.DECIMAL,
  },
  interes: {
    type: sequelize.DECIMAL,
  },
  cuota: {
    type: sequelize.DECIMAL
  },
  saldo_final: {
    type: sequelize.DECIMAL
  },
  credito_id: {
    type: sequelize.INTEGER,
    allowNull: false,
    validate: { notEmpty: true }
  }
}, {
  timestamps: false
});

Cuota.belongsTo(Credito, { foreignKey: 'credito_id', as: 'credito' });
Credito.hasMany(Cuota, { foreignKey: 'credito_id', as: 'cuotas' })

export default Cuota;