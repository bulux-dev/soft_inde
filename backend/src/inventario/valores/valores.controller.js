import fl from '../../../middleware/filtros.js';
import resp from '../../../middleware/resp.js';
import Valor from './valores.model.js';

let getAllValores = async (req, res) => {
  try {
    let where = fl(req.query);
    let valores = await Valor.findAll({
      where: where,
    });
    await resp.success({ mensaje: 'Valores encontrados', data: valores }, req, res, 'Valor');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getOneValor = async (req, res) => {
  try {
    let valor = await Valor.findOne({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Valor encontrado', data: valor }, req, res, 'Valor');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let createValor = async (req, res) => {
  try {
    let valor = await Valor.findOne({ where: { nombre: req.body.nombre } });
    if (valor) {
      return resp.error('Valor ya existente', req, res, 'Valor');
    } else {
      let valor = await Valor.create(req.body);
      await resp.success({ mensaje: 'Valor agregado', data: valor }, req, res, 'Valor'); 
    }
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let updateValor = async (req, res) => {
  try {
    let valor = await Valor.update(req.body, { where: { id: req.params.id } });
    await resp.success({ mensaje: 'Valor actualizado', data: valor }, req, res, 'Valor');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let deleteValor = async (req, res) => {
  try {
    let valor = await Valor.destroy({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Valor eliminado', data: valor }, req, res, 'Valor');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

export default {
  getAllValores,
  getOneValor,
  createValor,
  updateValor,
  deleteValor
}