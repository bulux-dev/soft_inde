import fl from '../../../middleware/filtros.js';
import resp from '../../../middleware/resp.js';
import Equivalencia from './equivalencias.model.js';

let getAllEquivalencias = async (req, res) => {
  try {
    let where = fl(req.query);
    let equivalencias = await Equivalencia.findAll({
      where: where,
    });
    await resp.success({ mensaje: 'Equivalencias encontradas', data: equivalencias }, req, res, 'Equivalencia');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getOneEquivalencia = async (req, res) => {
  try {
    let equivalencia = await Equivalencia.findOne({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Equivalencia encontrada', data: equivalencia }, req, res, 'Equivalencia');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let createEquivalencia = async (req, res) => {
  try {
    let equivalencia = await Equivalencia.create(req.body);
    await resp.success({ mensaje: 'Equivalencia agregada', data: equivalencia }, req, res, 'Equivalencia');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let updateEquivalencia = async (req, res) => {
  try {
    let equivalencia = await Equivalencia.update(req.body, { where: { id: req.params.id } });
    await resp.success({ mensaje: 'Equivalencia actualizada', data: equivalencia }, req, res, 'Equivalencia');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let deleteEquivalencia = async (req, res) => {
  try {
    let equivalencia = await Equivalencia.destroy({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Equivalencia eliminada', data: equivalencia }, req, res, 'Equivalencia');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

export default {
  getAllEquivalencias,
  getOneEquivalencia,
  createEquivalencia,
  updateEquivalencia,
  deleteEquivalencia
}