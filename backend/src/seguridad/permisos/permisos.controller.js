import Permiso from './permisos.model.js';
import resp from '../../../middleware/resp.js';
import fl from '../../../middleware/filtros.js';
import Accion from '../accion.model.js';
import { Op } from 'sequelize';

let getAllPermisos = async (req, res) => {
  try {
    let where = fl(req.query);
    let permisos = await Permiso.findAll({
      where: where,
      include: [
        {
          model: Accion, as: 'accion'
        }
      ]
    });
    await resp.success({ mensaje: 'Permisos encontrados', data: permisos }, req, res, 'Permiso');
  } catch (err) {
    await resp.error(err, req, res);
  }
}


let getAllPermisosByRolUsuario = async (req, res) => {
  try {
    let where = {
      rol_id: req.query.rol_id,
      usuario_id: req.query.usuario_id
    }
    if (req.query.usuario_id == 'null') {
      where.usuario_id = { [Op.is]: null }
    }
    let permisos = await Permiso.findAll({
      where: where,
      include: [
        {
          model: Accion, as: 'accion'
        }
      ]
    });
    await resp.success({ mensaje: 'Permisos encontrados', data: permisos }, req, res, 'Permiso');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getOnePermiso = async (req, res) => {
  try {
    let permiso = await Permiso.findOne({
      where: { id: req.params.id }
    });
    await resp.success({ mensaje: 'Permiso encontrado', data: permiso }, req, res, 'Permiso');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let createPermiso = async (req, res) => {
  try {
    let permiso = await Permiso.create(req.body);
    await resp.success({ mensaje: 'Permiso agregado', data: permiso }, req, res, 'Permiso');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let updatePermiso = async (req, res) => {
  try {
    let permiso = await Permiso.update(req.body, { where: { id: req.params.id } });
    await resp.success({ mensaje: 'Permiso actualizado', data: permiso }, req, res, 'Permiso');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let deletePermiso = async (req, res) => {
  try {
    let permiso = await Permiso.destroy({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Permiso eliminado', data: permiso }, req, res, 'Permiso');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

export default {
  getAllPermisos,
  getAllPermisosByRolUsuario,
  getOnePermiso,
  createPermiso,
  updatePermiso,
  deletePermiso
}