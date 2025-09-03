import fl from '../../../middleware/filtros.js';
import resp from '../../../middleware/resp.js';
import Moneda from './monedas.model.js';

let getAllMonedas = async (req, res) => {
  try {
    let where = fl(req.query);
    let monedas = await Moneda.findAll({
      where: where,
    });
    await resp.success({ mensaje: 'Monedas encontradas', data: monedas }, req, res, 'Moneda');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getOneMoneda = async (req, res) => {
  try {
    let moneda = await Moneda.findOne({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Moneda encontrada', data: moneda }, req, res, 'Moneda');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let createMoneda = async (req, res) => {
  try {
    let moneda = await Moneda.create(req.body);
    await resp.success({ mensaje: 'Moneda agregada', data: moneda }, req, res, 'Moneda');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let updateMoneda = async (req, res) => {
  try {
    let moneda = await Moneda.update(req.body, { where: { id: req.params.id } });
    await resp.success({ mensaje: 'Moneda actualizada', data: moneda }, req, res, 'Moneda');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let deleteMoneda = async (req, res) => {
  try {
    let moneda = await Moneda.destroy({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Moneda eliminada', data: moneda }, req, res, 'Moneda');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

export default {
  getAllMonedas,
  getOneMoneda,
  createMoneda,
  updateMoneda,
  deleteMoneda
}