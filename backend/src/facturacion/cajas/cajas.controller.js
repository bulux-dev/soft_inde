import { Op } from 'sequelize';
import jwt from 'jsonwebtoken';
import key from '../../../middleware/key.js';
import fs from 'fs';
import resp from '../../../middleware/resp.js';
import Caja from './cajas.model.js';
import Empresa from '../../empresas/empresas.model.js';
import Venta from '../ventas/ventas.model.js';
import Moneda from '../monedas/monedas.model.js';
import Pago from '../pagos/pagos.model.js';
import moment from 'moment';
import fl from '../../../middleware/filtros.js';

let getAllCajas = async (req, res) => {
  try {
    let where = fl(req.query, 'eq');
    if (req.params.fecha_inicio != 'null' && req.params.fecha_fin != 'null') {
      where.fecha_apertura = {
        [Op.between]: [
          moment(req.params.fecha_inicio).format('YYYY-MM-DD HH:mm'),
          moment(req.params.fecha_fin).format('YYYY-MM-DD HH:mm')
        ]
      }
    }
    let cajas = await Caja.findAll({
      where: where
    });
    await resp.success({ mensaje: 'Cajas encontradas', data: cajas }, req, res, 'Caja');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getCajaDoc = async (req, res) => {
  try {
    let token = req.query.token;
    let data = jwt.decode(token, key);
    let empresa = await Empresa.findOne({ where: { id: data.data.empresa_id } });
    let caja = await Caja.findOne({
      where: { id: req.params.caja_id },
    });
    let ventas = await Venta.findAll({
      where: {
        fecha: {
          [Op.between]: [caja.fecha_apertura, caja.fecha_cierre]
        },
        estado: 'VIGENTE',
        tipo_pago: 'CONTADO'
      },
      include: [
        {
          model: Moneda, as: 'moneda'
        },
        {
          model: Pago, as: 'pagos'
        }
      ]
    });
    ventas = JSON.parse(JSON.stringify(ventas));

    for (let v = 0; v < ventas.length; v++) {
      ventas[v].efectivo = 0;
      ventas[v].cambio = 0;
      ventas[v].tarjeta = 0;
      ventas[v].transferencia = 0;
      ventas[v].deposito = 0;
      ventas[v].cheque = 0;
      ventas[v].vale = 0;
      ventas[v].diferencia = 0;
      for (let p = 0; p < ventas[v].pagos.length; p++) {
        if (ventas[v].pagos[p].metodo == 'Efectivo') {
          ventas[v].efectivo += parseFloat(ventas[v].pagos[p].monto);
          ventas[v].cambio += parseFloat(ventas[v].pagos[p].cambio ? ventas[v].pagos[p].cambio : 0);
        }
        if (ventas[v].pagos[p].metodo == 'Tarjeta') {
          ventas[v].tarjeta += parseFloat(ventas[v].pagos[p].monto);
        }
        if (ventas[v].pagos[p].metodo == 'Transferencia') {
          ventas[v].transferencia += parseFloat(ventas[v].pagos[p].monto);
        }
        if (ventas[v].pagos[p].metodo == 'Cheque') {
          ventas[v].cheque += parseFloat(ventas[v].pagos[p].monto);
        }
        if (ventas[v].pagos[p].metodo == 'Deposito') {
          ventas[v].deposito += parseFloat(ventas[v].pagos[p].monto);
        }
        if (ventas[v].pagos[p].metodo == 'Vale') {
          ventas[v].vale += parseFloat(ventas[v].pagos[p].monto);
        }
      }
    }

    let totales = {
      efectivo: 0,
      cambio: 0,
      tarjeta: 0,
      transferencia: 0,
      deposito: 0,
      cheque: 0,
      vale: 0,
      diferencia: 0
    }

    for (let v = 0; v < ventas.length; v++) {
      totales.efectivo += parseFloat(ventas[v].efectivo) - parseFloat(ventas[v].cambio);
      totales.cambio += parseFloat(ventas[v].cambio);
      totales.tarjeta += parseFloat(ventas[v].tarjeta);
      totales.transferencia += parseFloat(ventas[v].transferencia);
      totales.deposito += parseFloat(ventas[v].deposito);
      totales.cheque += parseFloat(ventas[v].cheque);
      totales.vale += parseFloat(ventas[v].vale);
      totales.diferencia += parseFloat(ventas[v].diferencia);
    }

    // totales.efectivo += parseFloat(caja.monto_apertura);

    let file;
    if (req.query.tipo == 'pdf') {
      file = fs.readFileSync('./templates/caja.html', 'utf8');

    }
    if (req.query.tipo == 'ticket') {
      file = fs.readFileSync('./templates/tickets/caja.html', 'utf8');
    }

    file = file.replace('___caja', JSON.stringify(caja));
    file = file.replace('___ventas', JSON.stringify(ventas));
    file = file.replace('___totales', JSON.stringify(totales));
    file = file.replace('___empresa', JSON.stringify(empresa));
    file = file.replace('___token', JSON.stringify(req.query.token));
    res.send(file);
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getOneCaja = async (req, res) => {
  try {
    let caja = await Caja.findOne({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Caja encontrada', data: caja }, req, res, 'Caja');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let createCaja = async (req, res) => {
  try {
    let caja = await Caja.create(req.body);
    await resp.success({ mensaje: 'Caja agregada', data: caja }, req, res, 'Caja');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let updateCaja = async (req, res) => {
  try {
    let caja = await Caja.update(req.body, { where: { id: req.params.id } });
    await resp.success({ mensaje: 'Caja actualizada', data: caja }, req, res, 'Caja');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let deleteCaja = async (req, res) => {
  try {
    let caja = await Caja.destroy({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Caja eliminada', data: caja }, req, res, 'Caja');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

export default {
  getAllCajas,
  getCajaDoc,
  getOneCaja,
  createCaja,
  updateCaja,
  deleteCaja
}