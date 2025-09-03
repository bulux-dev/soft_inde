import fl from '../../../middleware/filtros.js';
import resp from '../../../middleware/resp.js';
import ventaDetalle from './ventas_detalles.model.js';

let getAllVentasDetalles = async (req, res) => {
  try {
    let where = fl(req.query);
    let ventas_detalles = await ventaDetalle.findAll({
      where: where,
    });
    await resp.success({ mensaje: 'Detalles de Ventas encontradas', data: ventas_detalles }, req, res, 'Venta Detalle');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getOneVentaDetalle = async (req, res) => {
  try {
    let venta_detalle = await ventaDetalle.findOne({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Detalle de Venta encontrada', data: venta_detalle }, req, res, 'Venta Detalle');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let createVentaDetalle = async (req, res) => {
  try {
    let venta_detalle = await ventaDetalle.create(req.body);
    await resp.success({ mensaje: 'Detalle de Venta agregada', data: venta_detalle }, req, res, 'Venta Detalle');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let updateVentaDetalle = async (req, res) => {
  try {
    let venta_detalle = await ventaDetalle.update(req.body, { where: { id: req.params.id } });
    await resp.success({ mensaje: 'Detalle de Venta actualizada', data: venta_detalle }, req, res, 'Venta Detalle');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let deleteVentaDetalle = async (req, res) => {
  try {
    let venta_detalle = await ventaDetalle.destroy({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Detalle de Venta eliminada', data: venta_detalle }, req, res, 'Venta Detalle');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

export default {
  getAllVentasDetalles,
  getOneVentaDetalle,
  createVentaDetalle,
  updateVentaDetalle,
  deleteVentaDetalle
}