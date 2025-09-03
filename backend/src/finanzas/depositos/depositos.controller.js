import fl from '../../../middleware/filtros.js';
import fs from 'fs';
import resp from '../../../middleware/resp.js';
import jwt from 'jsonwebtoken';
import Cliente from '../../personal/clientes/clientes.model.js';
import Usuario from '../../seguridad/usuarios/usuarios.model.js';
import Bodega from '../../ubicaciones/bodegas/bodegas.model.js';
import Sucursal from '../../ubicaciones/sucursales/sucursales.model.js';
import Documento from '../../facturacion/documentos/documentos.model.js';
import TipoDocumento from '../../facturacion/tipos_documentos/tipos_documentos.model.js';
import Deposito from './depositos.model.js';
import key from '../../../middleware/key.js';
import Empresa from '../../empresas/empresas.model.js';
import Moneda from '../../facturacion/monedas/monedas.model.js';
import moment from 'moment';
import Saldo from '../../facturacion/saldos/saldos.model.js';
import CuentaBancaria from '../../finanzas/cuentas_bancarias/cuentas_bancarias.model.js';
import { Op } from 'sequelize';
import Recibo from '../../facturacion/recibos/recibos.model.js';
import Venta from '../../facturacion/ventas/ventas.model.js';

let getAllDepositos = async (req, res) => {
  try {
    let where = fl(req.query);
    if (req.params.fecha_inicio != 'null' && req.params.fecha_fin != 'null') {
      where.fecha = {
        [Op.between]: [
          moment(req.params.fecha_inicio).format('YYYY-MM-DD HH:mm'),
          moment(req.params.fecha_fin).format('YYYY-MM-DD HH:mm')
        ]
      }
    }
    let depositos = await Deposito.findAll({
      where: where,
      include: [
        {
          model: Documento, as: 'documento',
          include: [
            {
              model: TipoDocumento, as: 'tipo_documento',
            },
            {
              model: Usuario, as: 'usuario',
              attributes: ['id', 'nombre', 'apellido']
            }
          ]
        },
        {
          model: Cliente, as: 'cliente',
        },
        {
          model: Sucursal, as: 'sucursal',
        },
        {
          model: Bodega, as: 'bodega',
        },
        {
          model: Moneda, as: 'moneda',
        },
        {
          model: Usuario, as: 'usuario',
          attributes: ['id', 'nombre', 'apellido']
        },
        {
          model: CuentaBancaria, as: 'cuenta_bancaria',
        },
        {
          model: Saldo, as: 'saldos',
          limit: 1,
          order: [['id', 'DESC']],
        }
      ],
      order: [
        ['fecha', 'DESC'],
        ['id', 'DESC']
      ]
    });
    await resp.success({ mensaje: 'Depositos encontrados', data: depositos }, req, res, 'Deposito');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getDepositoDoc = async (req, res) => {
  try {
    let token = req.query.token;
    let data = jwt.decode(token, key);
    let empresa = await Empresa.findOne({ where: { id: data.data.empresa_id } });
    let deposito = await Deposito.findOne({
      where: { id: req.params.deposito_id },
      include: [
        {
          model: Cliente, as: 'cliente',
        },
        {
          model: Sucursal, as: 'sucursal',
        },
        {
          model: Bodega, as: 'bodega',
        },
        {
          model: Moneda, as: 'moneda',
        },
        {
          model: CuentaBancaria, as: 'cuenta_bancaria',
        },
        {
          model: Recibo, as: 'recibos',
          include: [
            {
              model: Documento, as: 'documento',
              include: [
                {
                  model: TipoDocumento, as: 'tipo_documento',
                }
              ]
            }
          ]
        },
        {
          model: Saldo, as: 'saldos',
          include: [
            {
              model: Venta, as: 'venta',
              include: [
                {
                  model: Documento, as: 'documento',
                  include: [
                    {
                      model: TipoDocumento, as: 'tipo_documento',
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });
    let file = fs.readFileSync(`./templates/deposito.html`, 'utf8');

    file = file.replace('___deposito', JSON.stringify(deposito));
    file = file.replace('___empresa', JSON.stringify(empresa));
    file = file.replace('___token', JSON.stringify(req.query.token));
    res.send(file);
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getOneDeposito = async (req, res) => {
  try {
    let deposito = await Deposito.findOne({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Deposito encontrado', data: deposito }, req, res, 'Deposito');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let createDeposito = async (req, res) => {
  try {

    let documento = await Documento.findOne({ where: { id: req.body.documento_id } });
    req.body.serie = documento.serie;
    req.body.correlativo = documento.correlativo
    req.body.fecha = moment(req.body.fecha).format('YYYY-MM-DD HH:mm');

    let deposito = await Deposito.create(req.body);
    deposito.id = deposito.null;
    if (deposito) {

      let saldos = req.body.saldos;
      let recibos_bancos = req.body.recibos_bancos;

      // Saldos 
      if (saldos.length > 0) {
        let acumulado = 0;
        let acum = await Saldo.findOne({
          where: { cliente_id: req.body.cliente_id },
          limit: 1,
          order: [['id', 'DESC']]
        });
        if (acum && acum.saldo_acumulado) {
          acumulado = parseFloat(acum.saldo_acumulado);
        }
        saldos.forEach(async p => {
          acumulado = parseFloat(acumulado) - parseFloat(p.total);
          p.fecha = deposito.fecha;
          p.tipo = 'abono';
          p.saldo_acumulado = acumulado.toFixed(2);
          p.saldo_inicial = parseFloat(p.saldo_inicial).toFixed(2);
          p.saldo_final = parseFloat(p.saldo_final).toFixed(2);
          p.total = parseFloat(p.total).toFixed(2);
          p.cliente_id = req.body.cliente_id;
          p.deposito_id = deposito.id;
          await Saldo.create(p);
        });
      }

      // Recibos Bancos
      if (recibos_bancos.length > 0) {
        for (let rb = 0; rb < recibos_bancos.length; rb++) {
          await Recibo.update({ deposito_id: deposito.id }, { where: { id: recibos_bancos[rb].recibo_id } });
        }
      }

      // Incrementar correlativo de documento
      documento.correlativo = getNextCorrelativo(documento.correlativo)
      await Documento.update({
        correlativo: documento.correlativo
      }, { where: { id: documento.id } });

    }
    await resp.success({ mensaje: 'Deposito agregado', data: deposito }, req, res, 'Deposito');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let updateDeposito = async (req, res) => {
  try {
    let deposito = await Deposito.update(req.body, { where: { id: req.params.id } });
    await resp.success({ mensaje: 'Deposito actualizado', data: deposito }, req, res, 'Deposito');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let anularDeposito = async (req, res) => {
  try {
    let deposito = await Deposito.update(req.body, { where: { id: req.params.id } });

    // Saldos
    let acumulado = 0;
    let acum = await Saldo.findOne({
      where: { cliente_id: req.body.cliente_id },
      limit: 1,
      order: [['id', 'DESC']]
    });
    if (acum && acum.saldo_acumulado) {
      acumulado = parseFloat(acum.saldo_acumulado);
    }

    let saldos = await Saldo.findAll({ where: { deposito_id: req.params.id } });
    saldos.forEach(async s => {
      acumulado = parseFloat(acumulado) + parseFloat(s.total);
      await Saldo.create({
        saldo_inicial: s.saldo_final,
        tipo: 'cargo',
        total: s.total,
        saldo_final: parseFloat(s.saldo_final) + parseFloat(s.total),
        saldo_acumulado: acumulado,
        estado: 'ANULADO',
        cliente_id: s.cliente_id,
        venta_id: s.venta_id,
        deposito_id: s.deposito_id
      });
    })

    await resp.success({ mensaje: 'Deposito anulado', data: deposito }, req, res, 'Deposito');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let deleteDeposito = async (req, res) => {
  try {
    let deposito = await Deposito.destroy({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Deposito eliminado', data: deposito }, req, res, 'Deposito');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

export default {
  getAllDepositos,
  getOneDeposito,
  createDeposito,
  updateDeposito,
  anularDeposito,
  deleteDeposito,
  getDepositoDoc
}

function getNextCorrelativo(correlativo) {
  let res = '';
  let oldC = correlativo;
  let newC = parseInt(correlativo) + 1;
  for (let i = 0; i < (oldC.length - newC.toString().length); i++) {
    res += '0';
  }
  res += newC.toString();
  return res;
}