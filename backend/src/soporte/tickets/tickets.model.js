import db from '../../../database/db.js';
import sequelize from 'sequelize';
import Usuario from '../../seguridad/usuarios/usuarios.model.js';
import Error from '../../soporte/errores/errores.model.js';

let Ticket = db.define('tickets', {
  id: { 
    type: sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    validate: { notEmpty: true }
  },
  fecha: {
    type: sequelize.STRING,
    allowNull: false,
    validate: { notEmpty: true }
  },
  estado: {
    type: sequelize.STRING,
    allowNull: false,
    validate: { notEmpty: true }
  },
  asunto: {
    type: sequelize.TEXT,
    allowNull: false,
    validate: { notEmpty: true }
  },
  descripcion: {
    type: sequelize.TEXT,
    allowNull: false,
    validate: { notEmpty: true }
  },
  error_id: {
    type: sequelize.INTEGER,
    allowNull: true
  },
  usuario_id: {
    type: sequelize.INTEGER,
    allowNull: true
  }
});

Ticket.belongsTo(Error, { foreignKey: 'error_id', as: 'error' });
Error.hasMany(Ticket, { foreignKey: 'error_id', as: 'tickets' });

Ticket.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });
Usuario.hasMany(Ticket, { foreignKey: 'usuario_id', as: 'tickets' });

export default Ticket;