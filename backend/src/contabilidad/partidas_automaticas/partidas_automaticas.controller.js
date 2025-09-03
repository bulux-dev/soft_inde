import { Op } from "sequelize";
import fl from "../../../middleware/filtros.js";
import resp from "../../../middleware/resp.js";
import PartidaAutomatica from "./partidas_automaticas.model.js";

let getAllPartidasAutomaticas = async (req, res) => {
  try {
    let where = fl(req.query);
    where.partida_automatica_id = {
      [Op.eq]: null
    };
    let partidas_automaticas = await PartidaAutomatica.findAll({
      where: where
    });
    await resp.success({ mensaje: 'Partidas Automaticas encontradas', data: partidas_automaticas }, req, res, 'Partida Automatica');
  } catch (err) {
    await resp.error(err, req, res);
  }
}


let getOnePartidaAutomatica = async (req, res) => {
  try {
    let partidas_automaticas = await PartidaAutomatica.findOne({
      where: { id: req.params.id }
    });
    await resp.success({ mensaje: 'Partida Automatica encontrada', data: partidas_automaticas }, req, res, 'Partida Automatica');
  } catch (err) {
    await resp.error(err, req, res);
  }
}


let createPartidaAutomatica = async (req, res) => {
  try {
    let partidas_automaticas = await PartidaAutomatica.create(req.body);
    await resp.success({ mensaje: 'Partida Automatica agregada', data: partidas_automaticas }, req, res, 'Partida Automatica');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let updatePartidaAutomatica = async (req, res) => {
  try {
    let partidas_automaticas = await PartidaAutomatica.update({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Partida Automatica actualizada', data: partidas_automaticas }, req, res, 'Partida Automatica');
  } catch (err) {
    await resp.error(err, req, res);
  }
}


let deletePartidaAutomatica = async (req, res) => {
  try {
    let partidas_automaticas = await PartidaAutomatica.destroy({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Partida Automatica eliminada', data: partidas_automaticas }, req, res, 'Partida Automatica');
  } catch (err) {
    await resp.error(err, req, res);
  }
}




export default {
  getAllPartidasAutomaticas,
  getOnePartidaAutomatica,
  createPartidaAutomatica,
  updatePartidaAutomatica,
  deletePartidaAutomatica
}
