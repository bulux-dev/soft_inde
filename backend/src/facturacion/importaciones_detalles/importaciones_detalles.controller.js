import fl from '../../../middleware/filtros.js';
import resp from '../../../middleware/resp.js';
import Lote from '../../inventario/lotes/lotes.model.js';
import ImportacionDetalle from './importaciones_detalles.model.js';

let getAllImportacionesDetalles = async (req, res) => {
  try {
    let where = fl(req.query);
    let importaciones_detalles = await ImportacionDetalle.findAll({
      where: where,
      include: [
        {
          model: Lote, as: 'lote'
        }
      ]
    });
    await resp.success({ mensaje: 'Detalles de Importaciones encontradas', data: importaciones_detalles }, req, res, 'Importacion Detalle');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getOneImportacionDetalle = async (req, res) => {
  try {
    let importacion_detalle = await ImportacionDetalle.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: Lote, as: 'lote'
        }
      ]
    });
    await resp.success({ mensaje: 'Detalle de Importacion encontrada', data: importacion_detalle }, req, res, 'Importacion Detalle');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let createImportacionDetalle = async (req, res) => {
  try {
    let importacion_detalle = await ImportacionDetalle.create(req.body);
    await resp.success({ mensaje: 'Detalle de Importacion agregada', data: importacion_detalle }, req, res, 'Importacion Detalle');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let updateImportacionDetalle = async (req, res) => {
  try {
    let importacion_detalle = await ImportacionDetalle.update(req.body, { where: { id: req.params.id } });
    await resp.success({ mensaje: 'Detalle de Importacion actualizada', data: importacion_detalle }, req, res, 'Importacion Detalle');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let deleteImportacionDetalle = async (req, res) => {
  try {
    let importacion_detalle = await ImportacionDetalle.destroy({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Detalle de Importacion eliminada', data: importacion_detalle }, req, res, 'Importacion Detalle');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

export default {
  getAllImportacionesDetalles,
  getOneImportacionDetalle,
  createImportacionDetalle,
  updateImportacionDetalle,
  deleteImportacionDetalle
}