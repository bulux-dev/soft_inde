import fl from '../../../middleware/filtros.js';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import key from '../../../middleware/key.js';
import resp from '../../../middleware/resp.js';
import Error from '../../soporte/errores/errores.model.js';
import Usuario from '../../seguridad/usuarios/usuarios.model.js';
import Ticket from '../tickets/tickets.model.js';
import TicketMensaje from '../tickets_mensajes/tickets_mensajes.model.js';
import SoporteMailer from '../../../nodemailer/soporte.js';
import Empresa from '../../empresas/empresas.model.js';

let getAllTickets = async (req, res) => {
  try {
    let token = req.headers.authorization;
    let data = jwt.decode(token, key);
    let where = fl(req.query);

    if (data.data.rol_id != 1) {
      where.usuario_id = data.data.usuario_id
    }
    let tickets = await Ticket.findAll({
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
    await resp.success({ mensaje: 'Tickets encontrados', data: tickets }, req, res, 'Ticket');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getOneTicket = async (req, res) => {
  try {
    let ticket = await Ticket.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: TicketMensaje, as: 'tickets_mensajes',
          limit: 10,
          order: [
            ['id', 'DESC']
          ]
        },
        {
          model: Usuario, as: 'usuario'
        },
        {
          model: Error, as: 'error'
        }
      ]
    });
    ticket.tickets_mensajes = ticket.tickets_mensajes.sort((a, b) => a.id - b.id);
    await resp.success({ mensaje: 'Ticket encontrado', data: ticket }, req, res, 'Ticket');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let createTicket = async (req, res) => {
  try {
    let ticket = await Ticket.create(req.body);
    let empresa = await Empresa.findOne({ where: { slug: process.env.DATABASE } });
    let usuario = await Usuario.findOne({ where: { id: req.body.usuario_id } });

    let file = fs.readFileSync('./templates/email/ticket-abierto.html', 'utf8');
    file = file.replaceAll('{{empresa.nombre}}', empresa.nombre);
    file = file.replaceAll('{{empresa.direccion}}', empresa.direccion);
    file = file.replaceAll('{{empresa.color}}', empresa.color);
    file = file.replaceAll('{{empresa.logo}}', empresa.logo);
    file = file.replaceAll('{{usuario.nombre}}', usuario.nombre + ' ' + usuario.apellido);
    file = file.replaceAll('{{ticket.asunto}}', ticket.asunto);
    file = file.replaceAll('{{ticket.descripcion}}', ticket.descripcion);

    let message = {
      from: `"${empresa.nombre}" <soporte@${process.env.DOMAIN}>`,
      to: usuario.correo,
      subject: `Nuevo Ticket - ${usuario.nombre}`,
      html: file
    };
    SoporteMailer.sendMail(message, function (err, data) {
      if (err) {
        console.log(err);
      } else {
        console.log(data);
      }
    });

    await resp.success({ mensaje: 'Ticket agregado', data: ticket }, req, res, 'Ticket');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let updateTicket = async (req, res) => {
  try {
    let ticket = await Ticket.update(req.body, { where: { id: req.params.id } });
    await resp.success({ mensaje: 'Ticket actualizado', data: ticket }, req, res, 'Ticket');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let cerrarTicket = async (req, res) => {
  try {
    let ticket = await Ticket.update({ estado: 'Cerrado' }, { where: { id: req.params.id } });
    let empresa = await Empresa.findOne({ where: { slug: process.env.DATABASE } });
    let usuario = await Usuario.findOne({ where: { id: req.body.usuario_id } });

    let file = fs.readFileSync('./templates/email/ticket-cerrado.html', 'utf8');
    file = file.replaceAll('{{empresa.nombre}}', empresa.nombre);
    file = file.replaceAll('{{empresa.direccion}}', empresa.direccion);
    file = file.replaceAll('{{empresa.color}}', empresa.color);
    file = file.replaceAll('{{empresa.logo}}', empresa.logo);
    file = file.replaceAll('{{usuario.nombre}}', usuario.nombre + ' ' + usuario.apellido);
    file = file.replaceAll('{{ticket.asunto}}', req.body.asunto);
    file = file.replaceAll('{{ticket.descripcion}}', req.body.descripcion);

    let message = {
      from: `"${empresa.nombre}" <soporte@${process.env.DOMAIN}>`,
      to: usuario.correo,
      subject: `Ticket Cerrado - ${usuario.nombre}`,
      html: file
    };
    let info = await SoporteMailer.sendMail(message);  
    console.log(info);

    await resp.success({ mensaje: 'Ticket cerrado', data: ticket }, req, res, 'Ticket');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let deleteTicket = async (req, res) => {
  try {
    let ticket = await Ticket.destroy({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Ticket eliminado', data: ticket }, req, res, 'Ticket');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

export default {
  getAllTickets,
  getOneTicket,
  createTicket,
  updateTicket,
  cerrarTicket,
  deleteTicket
}