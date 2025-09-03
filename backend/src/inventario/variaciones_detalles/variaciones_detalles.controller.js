import fl from '../../../middleware/filtros.js';
import resp from '../../../middleware/resp.js';
import VariacionDetalle from './variaciones_detalles.model.js';

let getAllVariacionesDetalles = async (req, res) => {
  try {
    let where = fl(req.query);
    let variaciones_detalles = await VariacionDetalle.findAll({
      where: where,
    });
    await resp.success({ mensaje: 'Detalles de Variaciones encontradas', data: variaciones_detalles }, req, res, 'Variacion Detalle');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getOneVariacionDetalle = async (req, res) => {
  try {
    let variacion_detalle = await VariacionDetalle.findOne({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Detalle de Variacion encontrada', data: variacion_detalle }, req, res, 'Variacion Detalle');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let createVariacionDetalle = async (req, res) => {
  try {
    let variacion_detalle = await VariacionDetalle.create(req.body);
    await resp.success({ mensaje: 'Detalle de Variacion agregada', data: variacion_detalle }, req, res, 'Variacion Detalle');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let updateVariacionDetalle = async (req, res) => {
  try {
    let variacion_detalle = await VariacionDetalle.update(req.body, { where: { id: req.params.id } });
    await resp.success({ mensaje: 'Detalle de Variacion actualizada', data: variacion_detalle }, req, res, 'Variacion Detalle');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let deleteVariacionDetalle = async (req, res) => {
  try {
    let variacion_detalle = await VariacionDetalle.destroy({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Detalle de Variacion eliminada', data: variacion_detalle }, req, res, 'Variacion Detalle');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

export default {
  getAllVariacionesDetalles,
  getOneVariacionDetalle,
  createVariacionDetalle,
  updateVariacionDetalle,
  deleteVariacionDetalle
}