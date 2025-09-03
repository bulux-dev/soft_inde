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
import NDCliente from './nd_clientes.model.js';
import key from '../../../middleware/key.js';
import Empresa from '../../empresas/empresas.model.js';
import Moneda from '../monedas/monedas.model.js';
import Saldo from '../saldos/saldos.model.js';
import { Op } from 'sequelize';
import moment from 'moment';

let getAllNDClientes = async (req, res) => {
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
    let nd_clientes = await NDCliente.findAll({
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
    await resp.success({ mensaje: 'Notas Debitos encontradas', data: nd_clientes }, req, res, 'NDCliente');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getNDClienteDoc = async (req, res) => {
  try {
    let token = req.query.token;
    let data = jwt.decode(token, key);
    let empresa = await Empresa.findOne({ where: { id: data.data.empresa_id } });
    let nd_cliente = await NDCliente.findOne({
      where: { id: req.params.nd_cliente_id },
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
    let file = fs.readFileSync(`./templates/nd_cliente.html`, 'utf8');

    file = file.replace('___nd_cliente', JSON.stringify(nd_cliente));
    file = file.replace('___empresa', JSON.stringify(empresa));
    file = file.replace('___token', JSON.stringify(req.query.token));
    res.send(file);
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getOneNDCliente = async (req, res) => {
  try {
    let nd_cliente = await NDCliente.findOne({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Nota Debito encontrada', data: nd_cliente }, req, res, 'NDCliente');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let createNDCliente = async (req, res) => {
  try {

    let documento = await Documento.findOne({ where: { id: req.body.documento_id } });
    req.body.serie = documento.serie;
    req.body.correlativo = documento.correlativo
    req.body.fecha = moment(req.body.fecha).format('YYYY-MM-DD HH:mm');

    let nd_cliente = await NDCliente.create(req.body);
    nd_cliente.id = nd_cliente.null;
    if (nd_cliente) {

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
        acumulado = parseFloat(acumulado) + parseFloat(p.total);
        p.fecha = nd_cliente.fecha;
        p.tipo = 'abono';
        p.saldo_acumulado = acumulado
        p.cliente_id = req.body.cliente_id;
        p.nd_cliente_id = nd_cliente.id;
        await Saldo.create(p);
      });

      // Incrementar correlativo de documento
      documento.correlativo = getNextCorrelativo(documento.correlativo)
      await Documento.update({
        correlativo: documento.correlativo
      }, { where: { id: documento.id } });

    }
    await resp.success({ mensaje: 'Nota Debito agregada', data: nd_cliente }, req, res, 'NDCliente');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let updateNDCliente = async (req, res) => {
  try {
    let nd_cliente = await NDCliente.update(req.body, { where: { id: req.params.id } });
    await resp.success({ mensaje: 'Nota Debito actualizado', data: nd_cliente }, req, res, 'NDCliente');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let anularNDCliente = async (req, res) => {
  try {
    let nd_cliente = await NDCliente.update(req.body, { where: { id: req.params.id } });

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

    let saldos = await Saldo.findAll({ where: { nd_cliente_id: req.params.id } });
    saldos.forEach(async s => {
      acumulado = parseFloat(acumulado) - parseFloat(s.total);
      await Saldo.create({
        saldo_inicial: s.saldo_final,
        tipo: 'cargo',
        total: s.total,
        saldo_final: parseFloat(s.saldo_final) - parseFloat(s.total),
        saldo_acumulado: acumulado,
        estado: 'ANULADA',
        cliente_id: s.cliente_id,
        venta_id: s.venta_id,
        nd_cliente_id: s.nd_cliente_id
      });
    })

    await resp.success({ mensaje: 'Nota Debito anulada', data: nd_cliente }, req, res, 'NDCliente');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let deleteNDCliente = async (req, res) => {
  try {
    let nd_cliente = await NDCliente.destroy({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Nota Debito eliminada', data: nd_cliente }, req, res, 'NDCliente');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

export default {
  getAllNDClientes,
  getOneNDCliente,
  createNDCliente,
  updateNDCliente,
  anularNDCliente,
  deleteNDCliente,
  getNDClienteDoc
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