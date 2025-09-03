import { Op } from 'sequelize';
import fl from '../../../middleware/filtros.js';
import resp from '../../../middleware/resp.js';
import Banco from './bancos.model.js';

let getAllBancos = async (req, res) => {
  try {
    let where = fl(req.query);
    let bancos = await Banco.findAll({
      where: where
    });
  
    await resp.success({ mensaje: 'Bancos encontrados', data: bancos }, req, res, 'Banco');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getOneBanco = async (req, res) => {
  try {
    let banco = await Banco.findOne({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Banco encontrado', data: banco }, req, res, 'Banco');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let createBanco = async (req, res) => {
  try {
    let banco = await Banco.create(req.body);
    await resp.success({ mensaje: 'Banco agregado', data: banco }, req, res, 'Banco');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let updateBanco = async (req, res) => {
  try {
    let banco = await Banco.update(req.body, { where: { id: req.params.id } });
    await resp.success({ mensaje: 'Banco actualizado', data: banco }, req, res, 'Banco');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let deleteBanco = async (req, res) => {
  try {
    let banco = await Banco.destroy({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Banco eliminado', data: banco }, req, res, 'Banco');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

export default {
  getAllBancos,
  getOneBanco,
  createBanco,
  updateBanco,
  deleteBanco
}