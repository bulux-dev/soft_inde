import fl from '../../../middleware/filtros.js';
import resp from '../../../middleware/resp.js';
import Pago from './pagos.model.js';

let getAllPagos = async (req, res) => {
  try {
    let where = fl(req.query);
    let pagos = await Pago.findAll({
      where: where,
    });
    await resp.success({ mensaje: 'Pagos encontrados', data: pagos }, req, res, 'Pago');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getOnePago = async (req, res) => {
  try {
    let pago = await Pago.findOne({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Pago encontrado', data: pago }, req, res, 'Pago');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let createPago = async (req, res) => {
  try {
    let pago = await Pago.create(req.body);
    await resp.success({ mensaje: 'Pago agregado', data: pago }, req, res, 'Pago');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let updatePago = async (req, res) => {
  try {
    let pago = await Pago.update(req.body, { where: { id: req.params.id } });
    await resp.success({ mensaje: 'Pago actualizado', data: pago }, req, res, 'Pago');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let deletePago = async (req, res) => {
  try {
    let pago = await Pago.destroy({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Pago eliminado', data: pago }, req, res, 'Pago');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

export default {
  getAllPagos,
  getOnePago,
  createPago,
  updatePago,
  deletePago
}