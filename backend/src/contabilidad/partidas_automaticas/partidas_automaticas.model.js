import db from "../../../database/db.js";
import sequelize from "sequelize";

let PartidaAutomatica = db.define('partidas_automaticas', {
  id: {
    type: sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  nombre: {
    type: sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  tipo: {
    type: sequelize.STRING,
  },
  tipo_documento: {
    type: sequelize.STRING
  },
  categoria: {
    type: sequelize.STRING
  }
});

export default PartidaAutomatica;

