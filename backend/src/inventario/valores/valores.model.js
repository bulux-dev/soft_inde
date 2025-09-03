import db from '../../../database/db.js';
import sequelize from 'sequelize';
import Atributo from '../atributos/atributos.model.js';

let Valor = db.define('valores', {
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
  atributo_id: {
    type: sequelize.INTEGER
  }
}, {
  timestamps: false
});

Valor.belongsTo(Atributo, { foreignKey: 'atributo_id', as: 'atributo' });
Atributo.hasMany(Valor, { foreignKey: 'atributo_id', as: 'valores' });

export default Valor;