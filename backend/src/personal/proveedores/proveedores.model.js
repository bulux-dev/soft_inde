import db from '../../../database/db.js';
import sequelize from 'sequelize';

let Proveedor = db.define('proveedores', {
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
  nit: {
    type: sequelize.STRING
  },
  cui: {
    type: sequelize.STRING
  },
  direccion: {
    type: sequelize.TEXT
  },
  contacto: {
    type: sequelize.STRING
  },
  correo: {
    type: sequelize.STRING
  },
  telefono: {
    type: sequelize.STRING
  },
  dias_credito: {
    type: sequelize.STRING
  },
  pequeno_contribuyente: {
    type: sequelize.BOOLEAN
  },
  tarjeta_credito: {
    type: sequelize.BOOLEAN
  }
});

export default Proveedor;