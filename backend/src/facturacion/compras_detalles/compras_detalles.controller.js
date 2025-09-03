import fl from '../../../middleware/filtros.js';
import resp from '../../../middleware/resp.js';
import Lote from '../../inventario/lotes/lotes.model.js';
import CompraDetalle from './compras_detalles.model.js';

let getAllComprasDetalles = async (req, res) => {
  try {
    let where = fl(req.query);
    let compras_detalles = await CompraDetalle.findAll({
      where: where,
      include: [
        {
          model: Lote, as: 'lote'
        }
      ]
    });
    await resp.success({ mensaje: 'Detalles de Compras encontradas', data: compras_detalles }, req, res, 'Compra Detalle');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getOneCompraDetalle = async (req, res) => {
  try {
    let compra_detalle = await CompraDetalle.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: Lote, as: 'lote'
        }
      ]
    });
    await resp.success({ mensaje: 'Detalle de Compra encontrada', data: compra_detalle }, req, res, 'Compra Detalle');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let createCompraDetalle = async (req, res) => {
  try {
    let compra_detalle = await CompraDetalle.create(req.body);
    await resp.success({ mensaje: 'Detalle de Compra agregada', data: compra_detalle }, req, res, 'Compra Detalle');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let updateCompraDetalle = async (req, res) => {
  try {
    let compra_detalle = await CompraDetalle.update(req.body, { where: { id: req.params.id } });
    await resp.success({ mensaje: 'Detalle de Compra actualizada', data: compra_detalle }, req, res, 'Compra Detalle');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let deleteCompraDetalle = async (req, res) => {
  try {
    let compra_detalle = await CompraDetalle.destroy({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Detalle de Compra eliminada', data: compra_detalle }, req, res, 'Compra Detalle');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

export default {
  getAllComprasDetalles,
  getOneCompraDetalle,
  createCompraDetalle,
  updateCompraDetalle,
  deleteCompraDetalle
}