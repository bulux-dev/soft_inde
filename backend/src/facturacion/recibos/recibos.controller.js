import fl from '../../../middleware/filtros.js';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import key from '../../../middleware/key.js';
import resp from '../../../middleware/resp.js';
import Empresa from '../../empresas/empresas.model.js';
import Cliente from '../../personal/clientes/clientes.model.js';
import Usuario from '../../seguridad/usuarios/usuarios.model.js';
import Bodega from '../../ubicaciones/bodegas/bodegas.model.js';
import Sucursal from '../../ubicaciones/sucursales/sucursales.model.js';
import Documento from '../documentos/documentos.model.js';
import Pago from '../pagos/pagos.model.js';
import TipoDocumento from '../tipos_documentos/tipos_documentos.model.js';
import ReciboDetalle from '../recibos_detalles/recibos_detalles.model.js';
import Recibo from './recibos.model.js';
import Moneda from '../monedas/monedas.model.js';
import Saldo from '../saldos/saldos.model.js';
import { Op } from 'sequelize';
import moment from 'moment';

let getAllRecibos = async (req, res) => {
  try {
    let token = req.headers.authorization;
    let data = jwt.decode(token, key);
    if (data.data.rol_id !== 1) {
      if (!req.query.usuario_id) {
        req.query.usuario_id = data.data.usuario_id;
      }
    }

    let where = fl(req.query, 'eq');
    if (req.params.fecha_inicio != 'null' && req.params.fecha_fin != 'null') {
      where.fecha = {
        [Op.between]: [
          moment(req.params.fecha_inicio).format('YYYY-MM-DD HH:mm'),
          moment(req.params.fecha_fin).format('YYYY-MM-DD HH:mm')
        ]
      }
    }

    let recibos = await Recibo.findAll({
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
            },
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
      ],
      order: [
        ['fecha', 'DESC'],
        ['id', 'DESC']
      ]
    });
    await resp.success({ mensaje: 'Recibos encontrados', data: recibos }, req, res, 'Recibo');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getAllRecibosSaldos = async (req, res) => {
  try {
    let recibos = await Recibo.findAll({
      where: {
        estado: 'VIGENTE',
        deposito_id: { [Op.eq]: null },
        nota_credito_id: { [Op.eq]: null }
      },
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
      ],
      order: [
        ['fecha', 'DESC'],
        ['id', 'DESC']
      ]
    });
    await resp.success({ mensaje: 'Recibos encontrados', data: recibos }, req, res, 'Venta');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getReciboDoc = async (req, res) => {
  try {
    let token = req.query.token;
    let data = jwt.decode(token, key);
    let empresa = await Empresa.findOne({ where: { id: data.data.empresa_id } });
    let recibo = await Recibo.findOne({
      where: { id: req.params.recibo_id },
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
          model: ReciboDetalle, as: 'recibos_detalles',
        },
        {
          model: Pago, as: 'pagos',
        }
      ]
    })

    let file = fs.readFileSync('./templates/recibo.html', 'utf8');

    file = file.replace('___recibo', JSON.stringify(recibo));
    file = file.replace('___cliente', JSON.stringify(recibo.cliente));
    file = file.replace('___empresa', JSON.stringify(empresa));
    file = file.replace('___token', JSON.stringify(req.query.token));
    res.send(file);
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getOneRecibo = async (req, res) => {
  try {
    let recibo = await Recibo.findOne({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Recibo encontrado', data: recibo }, req, res, 'Recibo');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let createRecibo = async (req, res) => {
  try {

    let documento = await Documento.findOne({ where: { id: req.body.documento_id } });
    req.body.serie = documento.serie;
    req.body.correlativo = documento.correlativo
    req.body.fecha = moment(req.body.fecha).format('YYYY-MM-DD HH:mm');

    let recibo = await Recibo.create(req.body);
    recibo.id = recibo.null;
    if (recibo) {

      let recibos_detalles = req.body.recibos_detalles;
      let pagos = req.body.pagos;
      let saldos = req.body.saldos;

      // Recibos Detalles
      for (let r = 0; r < recibos_detalles.length; r++) {
        recibos_detalles[r].recibo_id = recibo.id
        await ReciboDetalle.create(recibos_detalles[r])
      }

      // Pagos
      pagos.forEach(async p => {
        p.recibo_id = recibo.id
        await Pago.create(p)
      });

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
      saldos.forEach(async p => {
        acumulado = parseFloat(acumulado) - parseFloat(p.total);
        p.fecha = recibo.fecha;
        p.tipo = 'abono';
        p.saldo_acumulado = acumulado
        p.cliente_id = req.body.cliente_id;
        p.recibo_id = recibo.id;
        await Saldo.create(p);
      });

      // Incrementar correlativo de documento
      documento.correlativo = getNextCorrelativo(documento.correlativo)
      await Documento.update({
        correlativo: documento.correlativo
      }, { where: { id: documento.id } });

    }
    await resp.success({ mensaje: 'Recibo agregado', data: recibo }, req, res, 'Recibo');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let updateRecibo = async (req, res) => {
  try {
    let recibo = await Recibo.update(req.body, { where: { id: req.params.id } });
    await resp.success({ mensaje: 'Recibo actualizado', data: recibo }, req, res, 'Recibo');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let anularRecibo = async (req, res) => {
  try {
    let recibo = await Recibo.update(req.body, { where: { id: req.params.id } });

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

    let saldos = await Saldo.findAll({ where: { recibo_id: req.params.id } });
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
        recibo_id: s.recibo_id
      });
    })

    await resp.success({ mensaje: 'Recibo anulado', data: recibo }, req, res, 'Recibo');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let deleteRecibo = async (req, res) => {
  try {
    let recibo = await Recibo.destroy({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Recibo eliminado', data: recibo }, req, res, 'Recibo');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

export default {
  getAllRecibos,
  getAllRecibosSaldos,
  getOneRecibo,
  createRecibo,
  updateRecibo,
  anularRecibo,
  deleteRecibo,
  getReciboDoc
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
