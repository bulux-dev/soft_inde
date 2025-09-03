import { Op } from 'sequelize';
import fl from '../../../middleware/filtros.js';
import resp from '../../../middleware/resp.js';
import CuentaBancaria from './cuentas_bancarias.model.js';
import Banco from '../bancos/bancos.model.js';

let getAllCuentasBancarias = async (req, res) => {
  try {
    let where = fl(req.query);
    let cuentas_bancarias = await CuentaBancaria.findAll({
      where: where,
      include: [
        {
          model: Banco, as: 'banco',
        }
      ]
    });
  
    await resp.success({ mensaje: 'Cuentas Bancarias encontradas', data: cuentas_bancarias }, req, res, 'Cuenta Bancaria');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getOneCuentaBancaria = async (req, res) => {
  try {
    let cuenta_bancaria = await CuentaBancaria.findOne({ 
      where: { id: req.params.id },
      include: [
        {
          model: Banco, as: 'banco',
        }
      ]
    });
    await resp.success({ mensaje: 'Cuenta Bancaria encontrada', data: cuenta_bancaria }, req, res, 'Cuenta Bancaria');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let createCuentaBancaria = async (req, res) => {
  try {
    let cuenta_bancaria = await CuentaBancaria.create(req.body);
    await resp.success({ mensaje: 'Cuenta Bancaria agregada', data: cuenta_bancaria }, req, res, 'Cuenta Bancaria');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let updateCuentaBancaria = async (req, res) => {
  try {
    let cuenta_bancaria = await CuentaBancaria.update(req.body, { where: { id: req.params.id } });
    await resp.success({ mensaje: 'Cuenta Bancaria actualizada', data: cuenta_bancaria }, req, res, 'Cuenta Bancaria');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let deleteCuentaBancaria = async (req, res) => {
  try {
    let cuenta_bancaria = await CuentaBancaria.destroy({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Cuenta Bancaria eliminada', data: cuenta_bancaria }, req, res, 'Cuenta Bancaria');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

export default {
  getAllCuentasBancarias,
  getOneCuentaBancaria,
  createCuentaBancaria,
  updateCuentaBancaria,
  deleteCuentaBancaria
}