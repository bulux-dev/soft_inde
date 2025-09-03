import fl from '../../../middleware/filtros.js';
import resp from '../../../middleware/resp.js';
import Valor from '../valores/valores.model.js';
import Termino from './terminos.model.js';

let getAllTerminos = async (req, res) => {
  try {
    let where = fl(req.query);
    let terminos = await Termino.findAll({
      where: where,
      include: [
        { model: Valor, as: 'valor' }
      ]
    });
    await resp.success({ mensaje: 'Terminos encontrados', data: terminos }, req, res, 'Termino');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getOneTermino = async (req, res) => {
  try {
    let termino = await Termino.findOne({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Termino encontrado', data: termino }, req, res, 'Termino');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let createTermino = async (req, res) => {
  try {
    let termino = await Termino.create(req.body);
    await resp.success({ mensaje: 'Termino agregado', data: termino }, req, res, 'Termino');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let updateTermino = async (req, res) => {
  try {
    let termino = await Termino.update(req.body, { where: { id: req.params.id } });
    await resp.success({ mensaje: 'Termino actualizado', data: termino }, req, res, 'Termino');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let deleteTermino = async (req, res) => {
  try {
    let termino = await Termino.destroy({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Termino eliminado', data: termino }, req, res, 'Termino');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

export default {
  getAllTerminos,
  getOneTermino,
  createTermino,
  updateTermino,
  deleteTermino
}