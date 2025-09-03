import fl from '../../../middleware/filtros.js';
import jwt from 'jsonwebtoken';
import key from '../../../middleware/key.js';
import resp from '../../../middleware/resp.js';
import Usuario from '../../seguridad/usuarios/usuarios.model.js';
import Error from '../errores/errores.model.js';

let getAllErrores = async (req, res) => {
  try {
    let token = req.headers.authorization;
    let data = jwt.decode(token, key);
    let where = fl(req.query);

    if (data.data.rol_id != 1) {
      where.usuario_id = data.data.usuario_id
    }
    let errores = await Error.findAll({
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
    await resp.success({ mensaje: 'Tickets mensajes encontrados', data: errores }, req, res, 'Ticket');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getOneError = async (req, res) => {
  try {
    let error = await Error.findOne({ 
      where: { id: req.params.id },
    });
    await resp.success({ mensaje: 'Ticket mensaje encontrado', data: error }, req, res, 'Ticket');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let createError = async (req, res) => {
  try {
    let error = await Error.create(req.body);
    await resp.success({ mensaje: 'Ticket mensaje agregado', data: error }, req, res, 'Ticket');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let updateError = async (req, res) => {
  try {
    let error = await Error.update(req.body, { where: { id: req.params.id } });
    await resp.success({ mensaje: 'Ticket mensaje actualizado', data: error }, req, res, 'Ticket');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let deleteError = async (req, res) => {
  try {
    let error = await Error.destroy({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Ticket mensaje eliminado', data: error }, req, res, 'Ticket');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

export default {
  getAllErrores,
  getOneError,
  createError,
  updateError,
  deleteError
}