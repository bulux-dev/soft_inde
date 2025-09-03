import fl from '../../../middleware/filtros.js';
import resp from '../../../middleware/resp.js';
import Empresa from '../../empresas/empresas.model.js';
import Credito from '../creditos/creditos.model.js';
import key from '../../../middleware/key.js';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import Amortizacion from './amortizaciones.model.js';
import Venta from '../ventas/ventas.model.js';
import Cliente from '../../personal/clientes/clientes.model.js';
import Recibo from '../recibos/recibos.model.js';

let getAllAmortizaciones = async (req, res) => {
  try {
    let where = fl(req.query);
    let amortizaciones = await Amortizacion.findAll({
      where: where,
      include: [
        {
          model: Recibo, as: 'recibo',
        }
      ]
    });
    await resp.success({ mensaje: 'Amortizaciones encontradas', data: amortizaciones }, req, res, 'Amortizacion');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getOneAmortizacion = async (req, res) => {
  try {
    let moneda = await Amortizacion.findOne({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Amortizacion encontrada', data: moneda }, req, res, 'Amortizacion');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getReciboAmortizacion = async (req, res) => {
  try {
    let token = req.query.token;
    let data = jwt.decode(token, key);
    let empresa = await Empresa.findOne({ where: { id: data.data.empresa_id } });
    let amortizacion = await Amortizacion.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: Credito, as: 'credito',
          include: [
            {
              model: Venta, as: 'venta',
              include: [
                {
                  model: Cliente, as: 'cliente',
                }
              ]
            }
          ]
        },
      ]
    })

    let file = fs.readFileSync('./templates/recibo-amortizacion.html', 'utf8');
    
    file = file.replace('___amortizacion', JSON.stringify(amortizacion));
    file = file.replace('___credito', JSON.stringify(amortizacion.credito));
    file = file.replace('___cliente', JSON.stringify(amortizacion.credito.venta.cliente));
    file = file.replace('___empresa', JSON.stringify(empresa));
    file = file.replace('___token', JSON.stringify(req.query.token));
    res.send(file);
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let createAmortizacion = async (req, res) => {
  try {
    let moneda = await Amortizacion.create(req.body);
    await resp.success({ mensaje: 'Amortizacion agregada', data: moneda }, req, res, 'Amortizacion');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let updateAmortizacion = async (req, res) => {
  try {
    let moneda = await Amortizacion.update(req.body, { where: { id: req.params.id } });
    await resp.success({ mensaje: 'Amortizacion actualizada', data: moneda }, req, res, 'Amortizacion');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let deleteAmortizacion = async (req, res) => {
  try {
    let moneda = await Amortizacion.destroy({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Amortizacion eliminada', data: moneda }, req, res, 'Amortizacion');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

export default {
  getAllAmortizaciones,
  getOneAmortizacion,
  createAmortizacion,
  updateAmortizacion,
  deleteAmortizacion,
  getReciboAmortizacion
}