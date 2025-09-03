import db from '../../database/admin.js';
import sequelize from 'sequelize';

let Empresa = db.define('empresas', {
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
  razon_social: {
    type: sequelize.STRING
  },
  slug: {
    type: sequelize.STRING,
    allowNull: false,
    validate: { notEmpty: true }
  },
  color: {
    type: sequelize.STRING
  },
  logo: {
    type: sequelize.TEXT
  },
  nit: {
    type: sequelize.STRING
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
  direccion: {
    type: sequelize.STRING
  },  
  sitio_web: {
    type: sequelize.STRING
  },
  puerto: {
    type: sequelize.INTEGER
  },
  acceso: {
    type: sequelize.BOOLEAN,
    validate: { notEmpty: true }
  },
  nit_fact: {
    type: sequelize.STRING
  },
  usuario_fact: {
    type: sequelize.STRING
  },
  clave_fact: {
    type: sequelize.STRING
  },
  token_fact: {
    type: sequelize.TEXT
  }
});

export default Empresa;
