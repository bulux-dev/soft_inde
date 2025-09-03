import fl from '../../../middleware/filtros.js';
import resp from '../../../middleware/resp.js';
import comandaDetalle from './comandas_detalles.model.js';

let getAllComandasDetalles = async (req, res) => {
  try {
    let where = fl(req.query);
    let comandas_detalles = await comandaDetalle.findAll({
      where: where,
    });
    await resp.success({ mensaje: 'Detalles de Comandas encontradas', data: comandas_detalles }, req, res, 'Comanda Detalle');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getOneComandaDetalle = async (req, res) => {
  try {
    let comanda_detalle = await comandaDetalle.findOne({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Detalle de Comanda encontrada', data: comanda_detalle }, req, res, 'Comanda Detalle');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let createComandaDetalle = async (req, res) => {
  try {
    let comanda_detalle = await comandaDetalle.create(req.body);
    await resp.success({ mensaje: 'Detalle de Comanda agregada', data: comanda_detalle }, req, res, 'Comanda Detalle');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let updateComandaDetalle = async (req, res) => {
  try {
    let comanda_detalle = await comandaDetalle.update(req.body, { where: { id: req.params.id } });
    await resp.success({ mensaje: 'Detalle de Comanda actualizada', data: comanda_detalle }, req, res, 'Comanda Detalle');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let deleteComandaDetalle = async (req, res) => {
  try {
    let comanda_detalle = await comandaDetalle.destroy({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Detalle de Comanda eliminada', data: comanda_detalle }, req, res, 'Comanda Detalle');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

export default {
  getAllComandasDetalles,
  getOneComandaDetalle,
  createComandaDetalle,
  updateComandaDetalle,
  deleteComandaDetalle
}