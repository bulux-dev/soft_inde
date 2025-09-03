import fl from '../../../middleware/filtros.js';
import resp from '../../../middleware/resp.js';
import Abono from './abonos.model.js';

let getAllAbonos = async (req, res) => {
  try {
    let where = fl(req.query);
    let abonos = await Abono.findAll({
      where: where,
    });
    await resp.success({ mensaje: 'Abonos encontrados', data: abonos }, req, res, 'Abono');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getOneAbono = async (req, res) => {
  try {
    let abono = await Abono.findOne({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Abono encontrado', data: abono }, req, res, 'Abono');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let createAbono = async (req, res) => {
  try {
    let abono = await Abono.create(req.body);
    await resp.success({ mensaje: 'Abono agregado', data: abono }, req, res, 'Abono');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let updateAbono = async (req, res) => {
  try {
    let abono = await Abono.update(req.body, { where: { id: req.params.id } });
    await resp.success({ mensaje: 'Abono actualizado', data: abono }, req, res, 'Abono');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let deleteAbono = async (req, res) => {
  try {
    let abono = await Abono.destroy({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Abono eliminado', data: abono }, req, res, 'Abono');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

export default {
  getAllAbonos,
  getOneAbono,
  createAbono,
  updateAbono,
  deleteAbono
}