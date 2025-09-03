import { Op } from "sequelize";
import fl from "../../../middleware/filtros.js";
import resp from "../../../middleware/resp.js";
import Presupuesto from './presupuestos.model.js'

let getAllPresupuestos = async (req, res) => {
  try {
    let where = fl(req.query);
    let presupuestos = await Presupuesto.findAll({
      where: where
    });
    await resp.success({ mensaje: 'Presupuestos encontrados', data: presupuestos }, req, res, 'Presupuesto');
  }
  catch (err) {
    await resp.error(err, req, res);
  }
}

let getOnePresupuesto = async (req, res) => {
  try {
    let presupuesto = await Presupuesto.findOne({
      where: { id: req.params.id }
    });
    await resp.success({ mensaje: 'Presupuesto encontrado', data: presupuesto }, req, res, 'Presupuesto');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let createPresupuesto = async (req, res) => {
  try {
    let ultimo_presupuesto = await Presupuesto.findOne({
      where: {},
       order: [['numero', 'DESC']] 
    });
    req.body.numero = (ultimo_presupuesto ? parseInt(ultimo_presupuesto.numero) + 1 : 1);
    let presupuesto = await Presupuesto.create(req.body);
    if (presupuesto) {
      return resp.error('Presupuesto ya existente', req, res);
    }

    presupuesto = await Presupuesto.create(req.body);
    await resp.success({ mensaje: 'Presupuesto agregado', data: presupuesto }, req, res, 'Presupuesto');
    console.log(presupuesto);
    console.log(presupuesto.numero)
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let updatePresupuesto = async (req, res) => {
  try {
    let presupuesto = await Presupuesto.update(req.body, { where: { id: req.params.id } });
    await resp.success({ mensaje: 'Presupuesto actualizado', data: presupuesto }, req, res, 'Presupuesto');
  } catch (err) {
    await resp.error(err, req, res);
  }
}


let deletePresupuesto = async (req, res) => {
  try {
    let presupuesto = await Presupuesto.destroy({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Presupuesto eliminado', data: presupuesto }, req, res, 'Presupuesto');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

export default {
  getAllPresupuestos,
  getOnePresupuesto,
  createPresupuesto,
  updatePresupuesto,
  deletePresupuesto
}