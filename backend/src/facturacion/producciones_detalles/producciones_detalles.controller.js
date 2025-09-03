import fl from '../../../middleware/filtros.js';
import resp from '../../../middleware/resp.js';
import Lote from '../../inventario/lotes/lotes.model.js';
import ProduccionDetalle from './producciones_detalles.model.js';

let getAllProduccionesDetalles = async (req, res) => {
  try {
    let where = fl(req.query);
    let producciones_detalles = await ProduccionDetalle.findAll({
      where: where,
      include: [
        {
          model: Lote, as: 'lote'
        }
      ]
    });
    await resp.success({ mensaje: 'Detalles de Producciones encontradas', data: producciones_detalles }, req, res, 'Produccion Detalle');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getOneProduccionDetalle = async (req, res) => {
  try {
    let produccion_detalle = await ProduccionDetalle.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: Lote, as: 'lote'
        }
      ]
    });
    await resp.success({ mensaje: 'Detalle de Produccion encontrada', data: produccion_detalle }, req, res, 'Produccion Detalle');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let createProduccionDetalle = async (req, res) => {
  try {
    let produccion_detalle = await ProduccionDetalle.create(req.body);
    await resp.success({ mensaje: 'Detalle de Produccion agregada', data: produccion_detalle }, req, res, 'Produccion Detalle');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let updateProduccionDetalle = async (req, res) => {
  try {
    let produccion_detalle = await ProduccionDetalle.update(req.body, { where: { id: req.params.id } });
    await resp.success({ mensaje: 'Detalle de Produccion actualizada', data: produccion_detalle }, req, res, 'Produccion Detalle');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let deleteProduccionDetalle = async (req, res) => {
  try {
    let produccion_detalle = await ProduccionDetalle.destroy({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Detalle de Produccion eliminada', data: produccion_detalle }, req, res, 'Produccion Detalle');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

export default {
  getAllProduccionesDetalles,
  getOneProduccionDetalle,
  createProduccionDetalle,
  updateProduccionDetalle,
  deleteProduccionDetalle
}