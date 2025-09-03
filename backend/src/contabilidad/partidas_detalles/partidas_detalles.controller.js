import { Op } from "sequelize";
import fl from "../../../middleware/filtros.js";
import resp from "../../../middleware/resp.js";
import PartidaDetalle from "./partidas_detalles.model.js";

let getAllPartidasDetalles = async (req, res) => {
  try {
    let where = fl(req.query);
    let partidas_detalles = await PartidaDetalle.findAll({
      where: where
    });
    await resp.success({ mensaje: 'Partidas Detalles encontradas', data: partidas_detalles }, req, res, 'Partida Detalle');
  } catch (err) {
    await resp.error(err, req, res);
  }
}


let getOnePartidaDetalle = async (req, res) => {
  try {
    let partidas_detalles = await PartidaDetalle.findOne({
      where: { id: req.params.id }
    });
    await resp.success({ mensaje: 'Partida Detalle encontrada', data: partidas_detalles }, req, res, 'Partida Detalle');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let createPartidaDetalle = async (req, res) => {
  try {
    let partidas_detalles = await PartidaDetalle.create(req.body);
    await resp.success({ mensaje: 'Partida Detalle creada', data: partidas_detalles }, req, res, 'Partida Detalle');
  } catch (err) {
    await resp.error(err, req, res);
  }
}


let updatePartidaDetalle = async (req, res) => {
  try {
    let partidas_detalles = await PartidaDetalle.update(req.body, { where: { id: req.params.id } });
    await resp.success({ mensaje: 'Partida Detalle actualizada', data: partidas_detalles }, req, res, 'Partida Detalle');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let deletePartidaDetalle = async (req, res) => {
  try {
    let partidas_detalles = await PartidaDetalle.destroy({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Partida Detalle eliminada', data: partidas_detalles }, req, res, 'Partida Detalle');
  } catch (err) {
    await resp.error(err, req, res);
  }
}


export default {
  getAllPartidasDetalles,
  getOnePartidaDetalle,
  createPartidaDetalle,
  updatePartidaDetalle,
  deletePartidaDetalle
}

