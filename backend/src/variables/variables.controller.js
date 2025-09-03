import fl from '../../middleware/filtros.js';
import resp from '../../middleware/resp.js';
import Variable from './variables.model.js';

let getAllVariables = async (req, res) => {
  try {
    let where = fl(req.query);
    let variables = await Variable.findAll({
      where: where,
    });
    await resp.success({ mensaje: 'Variables encontradas', data: variables }, req, res, 'Variable');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getOneVariable = async (req, res) => {
  try {
    let variable = await Variable.findOne({ where: { slug: req.params.slug } });
    await resp.success({ mensaje: 'Variable encontrada', data: variable }, req, res, 'Variable');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let createVariable = async (req, res) => {
  try {
    let variable = await Variable.create(req.body);
    await resp.success({ mensaje: 'Variable agregada', data: variable }, req, res, 'Variable');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let updateVariable = async (req, res) => {
  try {
    let variable = await Variable.update(req.body, { where: { slug: req.params.slug } });
    await resp.success({ mensaje: 'Variable actualizada', data: variable }, req, res, 'Variable');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let deleteVariable = async (req, res) => {
  try {
    let variable = await Variable.destroy({ where: { slug: req.params.slug } });
    await resp.success({ mensaje: 'Variable eliminada', data: variable }, req, res, 'Variable');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

export default {
  getAllVariables,
  getOneVariable,
  createVariable,
  updateVariable,
  deleteVariable
}