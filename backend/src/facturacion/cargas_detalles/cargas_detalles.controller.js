import fl from '../../../middleware/filtros.js';
import resp from '../../../middleware/resp.js';
import Lote from '../../inventario/lotes/lotes.model.js';
import CargaDetalle from './cargas_detalles.model.js';

let getAllCargasDetalles = async (req, res) => {
  try {
    let where = fl(req.query);
    let cargas_detalles = await CargaDetalle.findAll({
      where: where,
      include: [
        {
          model: Lote, as: 'lote'
        }
      ]
    });
    await resp.success({ mensaje: 'Detalles de Cargas encontradas', data: cargas_detalles }, req, res, 'Carga Detalle');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getOneCargaDetalle = async (req, res) => {
  try {
    let carga_detalle = await CargaDetalle.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: Lote, as: 'lote'
        }
      ]
    });
    await resp.success({ mensaje: 'Detalle de Carga encontrada', data: carga_detalle }, req, res, 'Carga Detalle');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let createCargaDetalle = async (req, res) => {
  try {
    let carga_detalle = await CargaDetalle.create(req.body);
    await resp.success({ mensaje: 'Detalle de Carga agregada', data: carga_detalle }, req, res, 'Carga Detalle');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let updateCargaDetalle = async (req, res) => {
  try {
    let carga_detalle = await CargaDetalle.update(req.body, { where: { id: req.params.id } });
    await resp.success({ mensaje: 'Detalle de Carga actualizada', data: carga_detalle }, req, res, 'Carga Detalle');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let deleteCargaDetalle = async (req, res) => {
  try {
    let carga_detalle = await CargaDetalle.destroy({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Detalle de Carga eliminada', data: carga_detalle }, req, res, 'Carga Detalle');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

export default {
  getAllCargasDetalles,
  getOneCargaDetalle,
  createCargaDetalle,
  updateCargaDetalle,
  deleteCargaDetalle
}