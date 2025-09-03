import fl from '../../../middleware/filtros.js';
import resp from '../../../middleware/resp.js';
import Rol from './roles.model.js';

let getAllRoles = async (req, res) => {
  try {
    let where = fl(req.query);
    let roles = await Rol.findAll({
      where: where,
    });
    await resp.success({ mensaje: 'Roles encontrados', data: roles }, req, res, 'Rol');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getOneRol = async (req, res) => {
  try {
    let rol = await Rol.findOne({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Rol encontrado', data: rol }, req, res, 'Rol');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let createRol = async (req, res) => {
  try {
    let rol = await Rol.create(req.body);
    await resp.success({ mensaje: 'Rol agregado', data: rol }, req, res, 'Rol');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let updateRol = async (req, res) => {
  try {
    let rol = await Rol.update(req.body, { where: { id: req.params.id } });
    await resp.success({ mensaje: 'Rol actualizado', data: rol }, req, res, 'Rol');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let deleteRol = async (req, res) => {
  try {
    let rol = await Rol.destroy({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Rol eliminado', data: rol }, req, res, 'Rol');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

export default {
  getAllRoles,
  getOneRol,
  createRol,
  updateRol,
  deleteRol
}