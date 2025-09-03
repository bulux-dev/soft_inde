import db from '../../../database/db.js';
import sequelize from 'sequelize';

let Empleado = db.define('empleados', {
  id: { 
    type: sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    validate: { notEmpty: true }
  },
  logo: {
    type: sequelize.TEXT
  },
  nombre: {
    type: sequelize.STRING,
    allowNull: false,
    validate: { notEmpty: true }
  },
  apellido: {
    type: sequelize.STRING,
    allowNull: false,
    validate: { notEmpty: true }
  },
  nit: {
    type: sequelize.STRING
  },
  cui: {
    type: sequelize.STRING
  },
  telefono: {
    type: sequelize.STRING
  },
  correo: {
    type: sequelize.STRING
  },
  direccion: {
    type: sequelize.STRING
  },
  vendedor: {
    type: sequelize.BOOLEAN
  },
  comision: {
    type: sequelize.DECIMAL
  },
  planilla: {
    type: sequelize.BOOLEAN
  },
});

export default Empleado;