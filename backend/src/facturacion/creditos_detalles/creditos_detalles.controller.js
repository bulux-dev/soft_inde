import fl from '../../../middleware/filtros.js';
import resp from '../../../middleware/resp.js';
import CreditoDetalle from './creditos_detalles.model.js';

let getAllCreditosDetalles = async (req, res) => {
  try {
    let where = fl(req.query);
    let creditos = await CreditoDetalle.findAll({
      where: where,
    });
    await resp.success({ mensaje: 'Creditos Detalles encontrados', data: creditos }, req, res, 'Credito Detalle');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getOneCreditoDetalle = async (req, res) => {
  try {
    let credito = await CreditoDetalle.findOne({
      where: { id: req.params.id },
    });
    await resp.success({ mensaje: 'Credito Detalle encontrado', data: credito }, req, res, 'Credito Detalle');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let createCreditoDetalle = async (req, res) => {
  try {
    let credito = await CreditoDetalle.upsert(req.body);
    await resp.success({ mensaje: 'Credito Detalle agregado', data: credito }, req, res, 'Credito Detalle');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let updateCreditoDetalle = async (req, res) => {
  try {
    let credito = await CreditoDetalle.update(req.body, { where: { id: req.params.id } });
    await resp.success({ mensaje: 'Credito Detalle actualizado', data: credito }, req, res, 'Credito Detalle');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let deleteCreditoDetalle = async (req, res) => {
  try {
    let credito = await CreditoDetalle.destroy({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Credito Detalle eliminado', data: credito }, req, res, 'Credito Detalle');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

export default {
  getAllCreditosDetalles,
  getOneCreditoDetalle,
  createCreditoDetalle,
  updateCreditoDetalle,
  deleteCreditoDetalle
}