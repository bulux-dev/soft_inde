import fl from '../../../middleware/filtros.js';
import resp from '../../../middleware/resp.js';
import reciboDetalle from './recibos_detalles.model.js';

let getAllRecibosDetalles = async (req, res) => {
  try {
    let where = fl(req.query);
    let recibos_detalles = await reciboDetalle.findAll({
      where: where,
    });
    await resp.success({ mensaje: 'Detalles de Recibos encontrados', data: recibos_detalles }, req, res, 'Recibo Detalle');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getOneReciboDetalle = async (req, res) => {
  try {
    let recibo_detalle = await reciboDetalle.findOne({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Detalle de Recibo encontrado', data: recibo_detalle }, req, res, 'Recibo Detalle');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let createReciboDetalle = async (req, res) => {
  try {
    let recibo_detalle = await reciboDetalle.create(req.body);
    await resp.success({ mensaje: 'Detalle de Recibo agregado', data: recibo_detalle }, req, res, 'Recibo Detalle');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let updateReciboDetalle = async (req, res) => {
  try {
    let recibo_detalle = await reciboDetalle.update(req.body, { where: { id: req.params.id } });
    await resp.success({ mensaje: 'Detalle de Recibo actualizado', data: recibo_detalle }, req, res, 'Recibo Detalle');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let deleteReciboDetalle = async (req, res) => {
  try {
    let recibo_detalle = await reciboDetalle.destroy({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Detalle de Recibo eliminado', data: recibo_detalle }, req, res, 'Recibo Detalle');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

export default {
  getAllRecibosDetalles,
  getOneReciboDetalle,
  createReciboDetalle,
  updateReciboDetalle,
  deleteReciboDetalle
}