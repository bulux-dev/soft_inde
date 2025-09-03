import db from '../../../database/db.js';
import sequelize from 'sequelize';
import Credito from '../creditos/creditos.model.js';
import Recibo from '../recibos/recibos.model.js';

let Amortizaciones = db.define('amortizaciones', {
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
  capital_acum: {
    type: sequelize.DECIMAL
  },
  interes_acum: {
    type: sequelize.DECIMAL
  },
  cuota_acum: {
    type: sequelize.DECIMAL
  },
  credito_id: {
    type: sequelize.INTEGER,
    allowNull: false,
    validate: { notEmpty: true }
  },
  recibo_id: {
    type: sequelize.INTEGER
  }
}, {
  timestamps: false
});

Amortizaciones.belongsTo(Credito, { foreignKey: 'credito_id', as: 'credito' });
Credito.hasMany(Amortizaciones, { foreignKey: 'credito_id', as: 'amortizaciones' })

Amortizaciones.belongsTo(Recibo, { foreignKey: 'recibo_id', as: 'recibo' });
Recibo.hasMany(Amortizaciones, { foreignKey: 'recibo_id', as: 'amortizaciones' });

export default Amortizaciones;