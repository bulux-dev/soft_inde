import db from '../../../database/db.js';
import sequelize from 'sequelize';
import Ticket from '../tickets/tickets.model.js';
import Usuario from '../../seguridad/usuarios/usuarios.model.js';

let TicketMensaje = db.define('tickets_mensajes', {
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
  mensaje: {
    type: sequelize.TEXT,
    allowNull: false,
    validate: { notEmpty: true }
  },
  ticket_id: {
    type: sequelize.INTEGER,
    allowNull: true
  },
  usuario_id: {
    type: sequelize.INTEGER,
    allowNull: true
  }
});

TicketMensaje.belongsTo(Ticket, { foreignKey: 'ticket_id', as: 'ticket' });
Ticket.hasMany(TicketMensaje, { foreignKey: 'ticket_id', as: 'tickets_mensajes' });

TicketMensaje.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });
Usuario.hasMany(TicketMensaje, { foreignKey: 'usuario_id', as: 'tickets_mensajes' });

export default TicketMensaje;