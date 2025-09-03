import fl from '../../../middleware/filtros.js';
import resp from '../../../middleware/resp.js';
import Lote from '../../inventario/lotes/lotes.model.js';
import DescargaDetalle from './descargas_detalles.model.js';

let getAllDescargasDetalles = async (req, res) => {
  try {
    let where = fl(req.query);
    let descargas_detalles = await DescargaDetalle.findAll({
      where: where,
      include: [
        {
          model: Lote, as: 'lote'
        }
      ]
    });
    await resp.success({ mensaje: 'Detalles de Descargas encontradas', data: descargas_detalles }, req, res, 'Descarga Detalle');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getOneDescargaDetalle = async (req, res) => {
  try {
    let descarga_detalle = await DescargaDetalle.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: Lote, as: 'lote'
        }
      ]
    });
    await resp.success({ mensaje: 'Detalle de Descarga encontrada', data: descarga_detalle }, req, res, 'Descarga Detalle');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let createDescargaDetalle = async (req, res) => {
  try {
    let descarga_detalle = await DescargaDetalle.create(req.body);
    await resp.success({ mensaje: 'Detalle de Descarga agregada', data: descarga_detalle }, req, res, 'Descarga Detalle');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let updateDescargaDetalle = async (req, res) => {
  try {
    let descarga_detalle = await DescargaDetalle.update(req.body, { where: { id: req.params.id } });
    await resp.success({ mensaje: 'Detalle de Descarga actualizada', data: descarga_detalle }, req, res, 'Descarga Detalle');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let deleteDescargaDetalle = async (req, res) => {
  try {
    let descarga_detalle = await DescargaDetalle.destroy({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Detalle de Descarga eliminada', data: descarga_detalle }, req, res, 'Descarga Detalle');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

export default {
  getAllDescargasDetalles,
  getOneDescargaDetalle,
  createDescargaDetalle,
  updateDescargaDetalle,
  deleteDescargaDetalle
}