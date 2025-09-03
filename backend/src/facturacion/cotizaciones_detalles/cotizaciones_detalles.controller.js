import fl from '../../../middleware/filtros.js';
import resp from '../../../middleware/resp.js';
import cotizacionDetalle from './cotizaciones_detalles.model.js';

let getAllCotizacionesDetalles = async (req, res) => {
  try {
    let where = fl(req.query);
    let cotizaciones_detalles = await cotizacionDetalle.findAll({
      where: where,
    });
    await resp.success({ mensaje: 'Detalles de Cotizaciones encontradas', data: cotizaciones_detalles }, req, res, 'Cotizacion Detalle');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getOneCotizacionDetalle = async (req, res) => {
  try {
    let cotizacion_detalle = await cotizacionDetalle.findOne({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Detalle de Cotizacion encontrada', data: cotizacion_detalle }, req, res, 'Cotizacion Detalle');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let createCotizacionDetalle = async (req, res) => {
  try {
    let cotizacion_detalle = await cotizacionDetalle.create(req.body);
    await resp.success({ mensaje: 'Detalle de Cotizacion agregada', data: cotizacion_detalle }, req, res, 'Cotizacion Detalle');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let updateCotizacionDetalle = async (req, res) => {
  try {
    let cotizacion_detalle = await cotizacionDetalle.update(req.body, { where: { id: req.params.id } });
    await resp.success({ mensaje: 'Detalle de Cotizacion actualizada', data: cotizacion_detalle }, req, res, 'Cotizacion Detalle');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let deleteCotizacionDetalle = async (req, res) => {
  try {
    let cotizacion_detalle = await cotizacionDetalle.destroy({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Detalle de Cotizacion eliminada', data: cotizacion_detalle }, req, res, 'Cotizacion Detalle');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

export default {
  getAllCotizacionesDetalles,
  getOneCotizacionDetalle,
  createCotizacionDetalle,
  updateCotizacionDetalle,
  deleteCotizacionDetalle
}