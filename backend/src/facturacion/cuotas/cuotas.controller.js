import fl from '../../../middleware/filtros.js';
import resp from '../../../middleware/resp.js';
import Cuota from './cuotas.model.js';

let getAllCuotas = async (req, res) => {
  try {
    let where = fl(req.query);
    let cuotas = await Cuota.findAll({
      where: where,
    });
    await resp.success({ mensaje: 'Cuotas encontradas', data: cuotas }, req, res, 'Cuota');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getOneCuota = async (req, res) => {
  try {
    let moneda = await Cuota.findOne({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Cuota encontrada', data: moneda }, req, res, 'Cuota');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let createCuota = async (req, res) => {
  try {
    let moneda = await Cuota.create(req.body);
    await resp.success({ mensaje: 'Cuota agregada', data: moneda }, req, res, 'Cuota');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let updateCuota = async (req, res) => {
  try {
    let moneda = await Cuota.update(req.body, { where: { id: req.params.id } });
    await resp.success({ mensaje: 'Cuota actualizada', data: moneda }, req, res, 'Cuota');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let deleteCuota = async (req, res) => {
  try {
    let moneda = await Cuota.destroy({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Cuota eliminada', data: moneda }, req, res, 'Cuota');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

export default {
  getAllCuotas,
  getOneCuota,
  createCuota,
  updateCuota,
  deleteCuota
}