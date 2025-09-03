import fl from '../../../middleware/filtros.js';
import fs from 'fs';
import resp from '../../../middleware/resp.js';
import jwt from 'jsonwebtoken';
import Cliente from '../../personal/clientes/clientes.model.js';
import Usuario from '../../seguridad/usuarios/usuarios.model.js';
import Bodega from '../../ubicaciones/bodegas/bodegas.model.js';
import Sucursal from '../../ubicaciones/sucursales/sucursales.model.js';
import Documento from '../documentos/documentos.model.js';
import TipoDocumento from '../tipos_documentos/tipos_documentos.model.js';
import NCCliente from './nc_clientes.model.js';
import key from '../../../middleware/key.js';
import Empresa from '../../empresas/empresas.model.js';
import Moneda from '../monedas/monedas.model.js';
import Saldo from '../saldos/saldos.model.js';
import { Op } from 'sequelize';
import moment from 'moment';

let getAllNCClientes = async (req, res) => {
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
    let nc_clientes = await NCCliente.findAll({
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
        {
          model: Saldo, as: 'saldos',
          limit: 1,
          order: [['id', 'DESC']],
        }
      ]
    });
    await resp.success({ mensaje: 'Notas Creditos encontradas', data: nc_clientes }, req, res, 'NCCliente');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getNCClienteDoc = async (req, res) => {
  try {
    let token = req.query.token;
    let data = jwt.decode(token, key);
    let empresa = await Empresa.findOne({ where: { id: data.data.empresa_id } });
    let nc_cliente = await NCCliente.findOne({
      where: { id: req.params.nc_cliente_id },
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
          model: Saldo, as: 'saldos',
          limit: 1,
          order: [['id', 'DESC']],
        }
      ]
    });
    let file = fs.readFileSync(`./templates/nc_cliente.html`, 'utf8');

    file = file.replace('___nc_cliente', JSON.stringify(nc_cliente));
    file = file.replace('___empresa', JSON.stringify(empresa));
    file = file.replace('___token', JSON.stringify(req.query.token));
    res.send(file);
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getOneNCCliente = async (req, res) => {
  try {
    let nc_cliente = await NCCliente.findOne({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Nota Credito encontrada', data: nc_cliente }, req, res, 'NCCliente');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let createNCCliente = async (req, res) => {
  try {

    let documento = await Documento.findOne({ where: { id: req.body.documento_id } });
    req.body.serie = documento.serie;
    req.body.correlativo = documento.correlativo
    req.body.fecha = moment(req.body.fecha).format('YYYY-MM-DD HH:mm');

    let nc_cliente = await NCCliente.create(req.body);
    nc_cliente.id = nc_cliente.null;
    if (nc_cliente) {

      let saldos = req.body.saldos;

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
        p.fecha = nc_cliente.fecha;
        p.tipo = 'abono';
        p.saldo_acumulado = acumulado
        p.cliente_id = req.body.cliente_id;
        p.nc_cliente_id = nc_cliente.id;
        await Saldo.create(p);
      });

      // Incrementar correlativo de documento
      documento.correlativo = getNextCorrelativo(documento.correlativo)
      await Documento.update({
        correlativo: documento.correlativo
      }, { where: { id: documento.id } });

    }
    await resp.success({ mensaje: 'Nota Credito agregada', data: nc_cliente }, req, res, 'NCCliente');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let updateNCCliente = async (req, res) => {
  try {
    let nc_cliente = await NCCliente.update(req.body, { where: { id: req.params.id } });
    await resp.success({ mensaje: 'Nota Credito actualizada', data: nc_cliente }, req, res, 'NCCliente');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let anularNCCliente = async (req, res) => {
  try {
    let nc_cliente = await NCCliente.update(req.body, { where: { id: req.params.id } });

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

    let saldos = await Saldo.findAll({ where: { nc_cliente_id: req.params.id } });
    saldos.forEach(async s => {
      acumulado = parseFloat(acumulado) + parseFloat(s.total);
      await Saldo.create({
        saldo_inicial: s.saldo_final,
        tipo: 'cargo',
        total: s.total,
        saldo_final: parseFloat(s.saldo_final) + parseFloat(s.total),
        saldo_acumulado: acumulado,
        estado: 'ANULADA',
        cliente_id: s.cliente_id,
        venta_id: s.venta_id,
        nc_cliente_id: s.nc_cliente_id
      });
    })

    await resp.success({ mensaje: 'Nota Credito anulada', data: nc_cliente }, req, res, 'NCCliente');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let deleteNCCliente = async (req, res) => {
  try {
    let nc_cliente = await NCCliente.destroy({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Nota Credito eliminada', data: nc_cliente }, req, res, 'NCCliente');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

export default {
  getAllNCClientes,
  getOneNCCliente,
  createNCCliente,
  updateNCCliente,
  anularNCCliente,
  deleteNCCliente,
  getNCClienteDoc
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