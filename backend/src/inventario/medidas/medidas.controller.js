import fl from '../../../middleware/filtros.js';
import resp from '../../../middleware/resp.js';
import Medida from './medidas.model.js';

let getAllMedidas = async (req, res) => {
  try {
    let where = fl(req.query);
    let medidas = await Medida.findAll({
      where: where
    });
    await resp.success({ mensaje: 'Medidas encontradas', data: medidas }, req, res, 'Medida');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getOneMedida = async (req, res) => {
  try {
    let medida = await Medida.findOne({ 
      where: { id: req.params.id }
    });
    await resp.success({ mensaje: 'Medida encontrada', data: medida }, req, res, 'Medida');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let createMedida = async (req, res) => {
  try {
    let medida = await Medida.create(req.body);
    await resp.success({ mensaje: 'Medida agregada', data: medida }, req, res, 'Medida');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let updateMedida = async (req, res) => {
  try {
    let medida = await Medida.update(req.body, { where: { id: req.params.id } });
    await resp.success({ mensaje: 'Medida actualizada', data: medida }, req, res, 'Medida');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let deleteMedida = async (req, res) => {
  try {
    let medida = await Medida.destroy({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Medida eliminada', data: medida }, req, res, 'Medida');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

export default {
  getAllMedidas,
  getOneMedida,
  createMedida,
  updateMedida,
  deleteMedida
}