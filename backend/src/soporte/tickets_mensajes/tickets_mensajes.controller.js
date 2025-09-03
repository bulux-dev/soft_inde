import fl from '../../../middleware/filtros.js';
import jwt from 'jsonwebtoken';
import key from '../../../middleware/key.js';
import resp from '../../../middleware/resp.js';
import Usuario from '../../seguridad/usuarios/usuarios.model.js';
import TicketMensaje from '../tickets_mensajes/tickets_mensajes.model.js';

let getAllTicketsMensajes = async (req, res) => {
  try {
    let token = req.headers.authorization;
    let data = jwt.decode(token, key);
    let where = fl(req.query);

    if (data.data.rol_id != 1) {
      where.usuario_id = data.data.usuario_id
    }
    let tickets_mensajes = await TicketMensaje.findAll({
      where: where,
      include: [
        {
          model: Usuario, as: 'usuario'
        }
      ],
      order: [
        ['fecha', 'DESC'],
        ['id', 'DESC']
      ]
    });
    await resp.success({ mensaje: 'Tickets mensajes encontrados', data: tickets_mensajes }, req, res, 'Ticket');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getOneTicketMensaje = async (req, res) => {
  try {
    let ticket_mensaje = await TicketMensaje.findOne({ 
      where: { id: req.params.id },
    });
    await resp.success({ mensaje: 'Ticket mensaje encontrado', data: ticket_mensaje }, req, res, 'Ticket');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let createTicketMensaje = async (req, res) => {
  try {
    let ticket_mensaje = await TicketMensaje.create(req.body);
    await resp.success({ mensaje: 'Ticket mensaje agregado', data: ticket_mensaje }, req, res, 'Ticket');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let updateTicketMensaje = async (req, res) => {
  try {
    let ticket_mensaje = await TicketMensaje.update(req.body, { where: { id: req.params.id } });
    await resp.success({ mensaje: 'Ticket mensaje actualizado', data: ticket_mensaje }, req, res, 'Ticket');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let deleteTicketMensaje = async (req, res) => {
  try {
    let ticket_mensaje = await TicketMensaje.destroy({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Ticket mensaje eliminado', data: ticket_mensaje }, req, res, 'Ticket');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

export default {
  getAllTicketsMensajes,
  getOneTicketMensaje,
  createTicketMensaje,
  updateTicketMensaje,
  deleteTicketMensaje
}