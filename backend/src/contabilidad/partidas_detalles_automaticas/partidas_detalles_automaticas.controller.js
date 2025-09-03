import { Op } from "sequelize";
import fl from "../../../middleware/filtros.js";
import resp from "../../../middleware/resp.js";
import PartidaDetalleAutomatica from './partidas_detalles_automaticas.model.js';

let getAllPartidaDetallesAutomaticas = async (req, res) => {
  try {
    let where = fl(req.query);
    where.partida_detalles_automatica_id = {
      [Op.eq]: null
    };
    let partida_detalles_automatica = await PartidaDetalleAutomatica.findAll({
      where: where
    });
    await resp.success({ mensaje: 'Partidas Detalles Automaticas encontradas', data: partida_detalles_automatica }, req, res, 'Partida Detalle Automatica');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getOnePartidaDetalleAutomatica = async (req, res) => {
  try {
    let partida_detalles_automatica = await PartidaDetalleAutomatica.findOne({
      where: { id: req.params.id }
    });
    await resp.success({ mensaje: 'Partida Detalles Automatica encontrada', data: partida_detalles_automatica }, req, res, 'Partida Detalle Encontrada');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let createPartidaDetalleAutomatica = async (req, res) => {
  try {
    let partida_detalles_automatica = await PartidaDetalleAutomatica.create(req.body);
    await resp.success({ mensaje: 'Partida Detalles Automatica agregada', data: partida_detalles_automatica }, req, res, 'Partida Detalle Automatica');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let updatePartidaDetalleAutomatica = async (req, res) => {
  try {
    let partida_detalles_automatica = await PartidaDetalleAutomatica.update(req.body, { where: { id: req.params.id } });
    await resp.success({ mensaje: 'Partida Detalles Automatica actualizada', data: partida_detalles_automatica }, req, res, 'Partida Detalle Automatica');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let deletePartidaDetalleAutomatica = async (req, res) => {
  try {
    let partida_detalles_automatica = await PartidaDetalleAutomatica.destroy({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Partida Detalles Automatica eliminada', data: partida_detalles_automatica }, req, res, 'Partida Automatica Detalle');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

export default {
  getAllPartidaDetallesAutomaticas,
  getOnePartidaDetalleAutomatica,
  createPartidaDetalleAutomatica,
  updatePartidaDetalleAutomatica,
  deletePartidaDetalleAutomatica
}
