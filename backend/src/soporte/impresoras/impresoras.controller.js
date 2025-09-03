import fl from '../../../middleware/filtros.js';
import resp from '../../../middleware/resp.js';
import Impresora from '../impresoras/impresoras.model.js';

let getAllImpresoras = async (req, res) => {
  try {
    let where = fl(req.query);
    let impresoras = await Impresora.findAll({
      where: where
    });
    await resp.success({ mensaje: 'Impresoras encontradas', data: impresoras }, req, res, 'Impresora');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getOneImpresora = async (req, res) => {
  try {
    let impresora = await Impresora.findOne({
      where: { id: req.params.id }
    });
    await resp.success({ mensaje: 'Impresora encontrada', data: impresora }, req, res, 'Impresora');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let createImpresora = async (req, res) => {
  try {
    let impresora = await Impresora.create(req.body);
    await resp.success({ mensaje: 'Impresora agregada', data: impresora }, req, res, 'Impresora');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let updateImpresora = async (req, res) => {
  try {
    let impresora = await Impresora.update(req.body, { where: { id: req.params.id } });
    await resp.success({ mensaje: 'Impresora actualizada', data: impresora }, req, res, 'Impresora');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let deleteImpresora = async (req, res) => {
  try {
    let impresora = await Impresora.destroy({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Impresora eliminada', data: impresora }, req, res, 'Impresora');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

export default {
  getAllImpresoras,
  getOneImpresora,
  createImpresora,
  updateImpresora,
  deleteImpresora
}