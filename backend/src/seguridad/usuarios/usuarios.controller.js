import hash from 'password-hash';
import Usuario from './usuarios.model.js';
import Rol from '../roles/roles.model.js';
import resp from '../../../middleware/resp.js';
import { Op } from 'sequelize';
import fl from '../../../middleware/filtros.js';

let getAllUsuarios = async (req, res) => {
  try {
    let where = fl(req.query);
    where.id = { [Op.ne]: 1 };
    let usuarios = await Usuario.findAll({
      where: where,
      include: [
        { model: Rol, as: 'rol' }
      ]
    });
    await resp.success({ mensaje: 'Usuarios encontrados', data: usuarios }, req, res, 'Usuario');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getOneUsuario = async (req, res) => {
  try {
    let usuario = await Usuario.findOne({
      where: { id: req.params.id },
      include: [
        { model: Rol, as: 'rol' }
      ]
    });
    await resp.success({ mensaje: 'Usuario encontrado', data: usuario }, req, res, 'Usuario');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let createUsuario = async (req, res) => {
  try {
    let usuario = await Usuario.findOne({ where: { usuario: req.body.usuario } });
    if (usuario) {
      await resp.error('Usuario ya existente', req, res);
    } else {
      req.body.clave = hash.generate(req.body.clave);
      await Usuario.create(req.body);
    }
    await resp.success({ mensaje: 'Usuario agregado', data: usuario }, req, res, 'Usuario');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let updateUsuario = async (req, res) => {
  try {
    if (req.body.clave) {
      req.body.clave = hash.generate(req.body.clave);
    } else {
      delete req.body.clave;
    }
    let usuario = await Usuario.update(req.body, { where: { id: req.params.id } });
    await resp.success({ mensaje: 'Usuario actualizado', data: usuario }, req, res, 'Usuario');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let deleteUsuario = async (req, res) => {
  try {
    let usuario = await Usuario.destroy({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Usuario eliminado', data: usuario }, req, res, 'Usuario');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

export default {
  getAllUsuarios,
  getOneUsuario,
  createUsuario,
  updateUsuario,
  deleteUsuario
}