import fl from '../../../middleware/filtros.js';
import fs from 'fs';
import resp from '../../../middleware/resp.js';
import jwt from 'jsonwebtoken';
import Proveedor from '../../personal/proveedores/proveedores.model.js';
import Usuario from '../../seguridad/usuarios/usuarios.model.js';
import Bodega from '../../ubicaciones/bodegas/bodegas.model.js';
import Sucursal from '../../ubicaciones/sucursales/sucursales.model.js';
import Documento from '../../facturacion/documentos/documentos.model.js';
import TipoDocumento from '../../facturacion/tipos_documentos/tipos_documentos.model.js';
import Cheque from './cheques.model.js';
import key from '../../../middleware/key.js';
import Empresa from '../../empresas/empresas.model.js';
import Moneda from '../../facturacion/monedas/monedas.model.js';
import moment from 'moment';
import Saldo from '../../facturacion/saldos/saldos.model.js';
import CuentaBancaria from '../../finanzas/cuentas_bancarias/cuentas_bancarias.model.js';
import { Op } from 'sequelize';
import Compra from '../../facturacion/compras/compras.model.js';

let getAllCheques = async (req, res) => {
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
    let cheques = await Cheque.findAll({
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
          model: Proveedor, as: 'proveedor',
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
    await resp.success({ mensaje: 'Cheques encontrados', data: cheques }, req, res, 'Cheque');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getChequeDoc = async (req, res) => {
  try {
    let token = req.query.token;
    let data = jwt.decode(token, key);
    let empresa = await Empresa.findOne({ where: { id: data.data.empresa_id } });
    let cheque = await Cheque.findOne({
      where: { id: req.params.cheque_id },
      include: [
        {
          model: Proveedor, as: 'proveedor',
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
          model: Saldo, as: 'saldos',
          include: [
            {
              model: Compra, as: 'compra',
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

    let file = fs.readFileSync(`./templates/cheque.html`, 'utf8');

    file = file.replace('___cheque', JSON.stringify(cheque));
    file = file.replace('___empresa', JSON.stringify(empresa));
    file = file.replace('___token', JSON.stringify(req.query.token));
    res.send(file);
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getOneCheque = async (req, res) => {
  try {
    let cheque = await Cheque.findOne({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Cheque encontrado', data: cheque }, req, res, 'Cheque');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let createCheque = async (req, res) => {
  try {

    let documento = await Documento.findOne({ where: { id: req.body.documento_id } });
    req.body.serie = documento.serie;
    req.body.correlativo = documento.correlativo
    req.body.fecha = moment(req.body.fecha).format('YYYY-MM-DD HH:mm');

    let cheque = await Cheque.create(req.body);
    cheque.id = cheque.null;
    if (cheque) {

      let saldos = req.body.saldos;

      // Saldos
      if (saldos.length > 0) {
        let acumulado = 0;
        let acum = await Saldo.findOne({
          where: { proveedor_id: req.body.proveedor_id },
          limit: 1,
          order: [['id', 'DESC']]
        });
        if (acum && acum.saldo_acumulado) {
          acumulado = parseFloat(acum.saldo_acumulado);
        }

        saldos.forEach(async p => {
          acumulado = parseFloat(acumulado) - parseFloat(p.total);
          p.fecha = cheque.fecha;
          p.tipo = 'abono';
          p.saldo_acumulado = acumulado.toFixed(2);
          p.saldo_inicial = parseFloat(p.saldo_inicial).toFixed(2);
          p.saldo_final = parseFloat(p.saldo_final).toFixed(2);
          p.total = parseFloat(p.total).toFixed(2);
          p.proveedor_id = req.body.proveedor_id;
          p.cheque_id = cheque.id;
          await Saldo.create(p);
        });
      }

      // Incrementar correlativo de documento
      documento.correlativo = getNextCorrelativo(documento.correlativo)
      await Documento.update({
        correlativo: documento.correlativo
      }, { where: { id: documento.id } });

    }
    await resp.success({ mensaje: 'Cheque agregado', data: cheque }, req, res, 'Cheque');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let updateCheque = async (req, res) => {
  try {
    let cheque = await Cheque.update(req.body, { where: { id: req.params.id } });
    await resp.success({ mensaje: 'Cheque actualizado', data: cheque }, req, res, 'Cheque');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let anularCheque = async (req, res) => {
  try {
    let cheque = await Cheque.update(req.body, { where: { id: req.params.id } });

    // Saldos
    let acumulado = 0;
    let acum = await Saldo.findOne({
      where: { proveedor_id: req.body.proveedor_id },
      limit: 1,
      order: [['id', 'DESC']]
    });
    if (acum && acum.saldo_acumulado) {
      acumulado = parseFloat(acum.saldo_acumulado);
    }

    let saldos = await Saldo.findAll({ where: { cheque_id: req.params.id } });
    saldos.forEach(async s => {
      acumulado = parseFloat(acumulado) + parseFloat(s.total);
      await Saldo.create({
        saldo_inicial: s.saldo_final,
        tipo: 'cargo',
        total: s.total,
        saldo_final: parseFloat(s.saldo_final) + parseFloat(s.total),
        saldo_acumulado: acumulado,
        estado: 'ANULADO',
        proveedor_id: s.proveedor_id,
        compra_id: s.compra_id,
        cheque_id: s.cheque_id
      });
    })

    await resp.success({ mensaje: 'Cheque anulado', data: cheque }, req, res, 'Cheque');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let deleteCheque = async (req, res) => {
  try {
    let cheque = await Cheque.destroy({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Cheque eliminado', data: cheque }, req, res, 'Cheque');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

export default {
  getAllCheques,
  getOneCheque,
  createCheque,
  updateCheque,
  anularCheque,
  deleteCheque,
  getChequeDoc
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