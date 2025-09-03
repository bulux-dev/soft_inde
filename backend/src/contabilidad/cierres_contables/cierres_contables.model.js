import db from "../../../database/db.js";
import sequelize from "sequelize";

let Partida = db.define("cierres_contables", {
  id: {
    type: sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  mes: {
    type: sequelize.STRING,
    allowNull: false,
  },
  estado: {
    type: sequelize.STRING,
    allowNull: false,
  },
  saldo_inicial: {
    type: sequelize.STRING,
    allowNull: false,
  },
  creditos: {
    type: sequelize.STRING,
    allowNull: false,
  },
  debitos: {
    type: sequelize.STRING,
    allowNull: false,
  },
  saldo_final: {
    type: sequelize.STRING,
    allowNull: false,
  },
  saldo_mensual: {
    type: sequelize.STRING,
    allowNull: false,
  },
});

export default CierreContable;
