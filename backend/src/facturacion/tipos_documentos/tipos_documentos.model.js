import db from '../../../database/db.js';
import sequelize from 'sequelize';

let TipoDocumento = db.define('tipos_documentos', {
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
  slug: {
    type: sequelize.STRING
  },
  inv_entrada: {
    type: sequelize.BOOLEAN,
  },
  inv_salida: {
    type: sequelize.BOOLEAN
  },
  costo : {
    type: sequelize.BOOLEAN
  },
  precio : {
    type: sequelize.BOOLEAN
  }
}, {
  timestamps: false
});

export default TipoDocumento;