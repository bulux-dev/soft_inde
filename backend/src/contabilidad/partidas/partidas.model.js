import db from '../../../database/db.js'
import sequelize from 'sequelize'

let Partida = db.define('partidas', {
  id: {
    type: sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  fecha: {
    type: sequelize.STRING,
  },
  numero: {
    type: sequelize.INTEGER,
  },
  total: {
    type: sequelize.STRING,
  },
  descripcion: {
    type: sequelize.STRING,
  },
  tipo: {
    type: sequelize.STRING,
  },
  tipo_documento: {
    type: sequelize.STRING,
  },
  categoria: {
    type: sequelize.STRING,
  },
  estado: {
    type: sequelize.STRING,
  }
});

export default Partida;