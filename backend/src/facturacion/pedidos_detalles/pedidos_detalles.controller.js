import fl from '../../../middleware/filtros.js';
import resp from '../../../middleware/resp.js';
import pedidoDetalle from './pedidos_detalles.model.js';

let getAllPedidosDetalles = async (req, res) => {
  try {
    let where = fl(req.query);
    let pedidos_detalles = await pedidoDetalle.findAll({
      where: where,
    });
    await resp.success({ mensaje: 'Detalles de Pedidos encontradas', data: pedidos_detalles }, req, res, 'Pedido Detalle');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getOnePedidoDetalle = async (req, res) => {
  try {
    let pedido_detalle = await pedidoDetalle.findOne({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Detalle de Pedido encontrada', data: pedido_detalle }, req, res, 'Pedido Detalle');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let createPedidoDetalle = async (req, res) => {
  try {
    let pedido_detalle = await pedidoDetalle.create(req.body);
    await resp.success({ mensaje: 'Detalle de Pedido agregada', data: pedido_detalle }, req, res, 'Pedido Detalle');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let updatePedidoDetalle = async (req, res) => {
  try {
    let pedido_detalle = await pedidoDetalle.update(req.body, { where: { id: req.params.id } });
    await resp.success({ mensaje: 'Detalle de Pedido actualizada', data: pedido_detalle }, req, res, 'Pedido Detalle');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let deletePedidoDetalle = async (req, res) => {
  try {
    let pedido_detalle = await pedidoDetalle.destroy({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Detalle de Pedido eliminada', data: pedido_detalle }, req, res, 'Pedido Detalle');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

export default {
  getAllPedidosDetalles,
  getOnePedidoDetalle,
  createPedidoDetalle,
  updatePedidoDetalle,
  deletePedidoDetalle
}