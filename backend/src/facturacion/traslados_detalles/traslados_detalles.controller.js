
import fl from '../../../middleware/filtros.js';
import resp from '../../../middleware/resp.js';
import Lote from '../../inventario/lotes/lotes.model.js';
import TrasladoDetalle from './traslados_detalles.model.js';

let getAllTrasladosDetalles = async (req, res) => {
  try {
    let where = fl(req.query);
    let traslados_detalles = await TrasladoDetalle.findAll({
      where: where,
      include: [
        {
          model: Lote, as: 'lote'
        }
      ]
    });
    await resp.success({ mensaje: 'Detalles de Traslados encontradas', data: traslados_detalles }, req, res, 'Traslado Detalle');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getOneTrasladoDetalle = async (req, res) => {
  try {
    let traslado_detalle = await TrasladoDetalle.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: Lote, as: 'lote'
        }
      ]
    });
    await resp.success({ mensaje: 'Detalle de Traslado encontrada', data: traslado_detalle }, req, res, 'Traslado Detalle');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let createTrasladoDetalle = async (req, res) => {
  try {
    let traslado_detalle = await TrasladoDetalle.create(req.body);
    await resp.success({ mensaje: 'Detalle de Traslado agregada', data: traslado_detalle }, req, res, 'Traslado Detalle');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let updateTrasladoDetalle = async (req, res) => {
  try {
    let traslado_detalle = await TrasladoDetalle.update(req.body, { where: { id: req.params.id } });
    await resp.success({ mensaje: 'Detalle de Traslado actualizada', data: traslado_detalle }, req, res, 'Traslado Detalle');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let deleteTrasladoDetalle = async (req, res) => {
  try {
    let traslado_detalle = await TrasladoDetalle.destroy({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Detalle de Traslado eliminada', data: traslado_detalle }, req, res, 'Traslado Detalle');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

export default {
  getAllTrasladosDetalles,
  getOneTrasladoDetalle,
  createTrasladoDetalle,
  updateTrasladoDetalle,
  deleteTrasladoDetalle
}