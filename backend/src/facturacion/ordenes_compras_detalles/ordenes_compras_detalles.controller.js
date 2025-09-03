import fl from '../../../middleware/filtros.js';
import resp from '../../../middleware/resp.js';
import Lote from '../../inventario/lotes/lotes.model.js';
import OrdenCompraDetalle from './ordenes_compras_detalles.model.js';

let getAllOrdenesComprasDetalles = async (req, res) => {
  try {
    let where = fl(req.query);
    let ordenes_compras_detalles = await OrdenCompraDetalle.findAll({
      where: where,
      include: [
        {
          model: Lote, as: 'lote'
        }
      ]
    });
    await resp.success({ mensaje: 'Detalles de Ordenes Compras encontradas', data: ordenes_compras_detalles }, req, res, 'Orden Compra Detalle');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getOneOrdenCompraDetalle = async (req, res) => {
  try {
    let orden_compra_detalle = await OrdenCompraDetalle.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: Lote, as: 'lote'
        }
      ]
    });
    await resp.success({ mensaje: 'Detalle de Ordenes Compra encontrada', data: orden_compra_detalle }, req, res, 'Orden Compra Detalle');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let createOrdenCompraDetalle = async (req, res) => {
  try {
    let orden_compra_detalle = await OrdenCompraDetalle.create(req.body);
    await resp.success({ mensaje: 'Detalle de Ordenes Compra agregada', data: orden_compra_detalle }, req, res, 'Orden Compra Detalle');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let updateOrdenCompraDetalle = async (req, res) => {
  try {
    let orden_compra_detalle = await OrdenCompraDetalle.update(req.body, { where: { id: req.params.id } });
    await resp.success({ mensaje: 'Detalle de Ordenes Compra actualizada', data: orden_compra_detalle }, req, res, 'Orden Compra Detalle');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let deleteOrdenCompraDetalle = async (req, res) => {
  try {
    let orden_compra_detalle = await OrdenCompraDetalle.destroy({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Detalle de Ordenes Compra eliminada', data: orden_compra_detalle }, req, res, 'Orden Compra Detalle');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

export default {
  getAllOrdenesComprasDetalles,
  getOneOrdenCompraDetalle,
  createOrdenCompraDetalle,
  updateOrdenCompraDetalle,
  deleteOrdenCompraDetalle
}