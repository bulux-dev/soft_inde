import fl from '../../../middleware/filtros.js';
import resp from '../../../middleware/resp.js';
import Empresa from '../../empresas/empresas.model.js';
import Saldo from '../../facturacion/saldos/saldos.model.js';
import Cliente from '../clientes/clientes.model.js';
import key from '../../../middleware/key.js';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import { Op, where } from 'sequelize';
import moment from 'moment';
import Documento from '../../facturacion/documentos/documentos.model.js';
import Venta from '../../facturacion/ventas/ventas.model.js';
import Recibo from '../../facturacion/recibos/recibos.model.js';
import Deposito from '../../finanzas/depositos/depositos.model.js';
import NotaCredito from '../../finanzas/notas_creditos/notas_creditos.model.js';
import NCCliente from '../../facturacion/nc_clientes/nc_clientes.model.js';
import NDCliente from '../../facturacion/nd_clientes/nd_clientes.model.js';
import TipoDocumento from '../../facturacion/tipos_documentos/tipos_documentos.model.js';

let getAllClientes = async (req, res) => {
  try {
    let where = fl(req.query);
    let clientes = await Cliente.findAll({
      where: where,
    });
    await resp.success({ mensaje: 'Clientes encontrados', data: clientes }, req, res, 'Cliente');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getOneCliente = async (req, res) => {
  try {
    let cliente = await Cliente.findOne({
      where: { id: req.params.id },
    });
    await resp.success({ mensaje: 'Cliente encontrado', data: cliente }, req, res, 'Cliente');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let reporteCXC = async (req, res) => {
  try {
    let token = req.query.token;
    let data = jwt.decode(token, key);

    let empresa = await Empresa.findOne({ where: { id: data.data.empresa_id } });

    let fecha_inicio = moment(req.query.fecha_inicio).format('YYYY-MM-DD HH:mm');
    let fecha_fin = moment(req.query.fecha_fin).format('YYYY-MM-DD HH:mm');

    let clientes = await Cliente.findAll({
      include: [
        {
          model: Saldo, as: 'saldos',
          limit: 1,
          order: [['id', 'DESC']],
          required: true
        },
      ]
    });

    clientes = JSON.parse(JSON.stringify(clientes));

    clientes = clientes.filter(c => c.saldos.length > 0 && parseFloat(c.saldos[0].saldo_acumulado).toFixed(2) > 0);

    let total_saldo = 0;

    for (let c = 0; c < clientes.length; c++) {
      for (let v = 0; v < clientes[c].saldos.length; v++) {
        total_saldo += parseFloat(clientes[c].saldos[0].saldo_acumulado);
      }
    }

    let file = fs.readFileSync('./templates/cxc.html', 'utf8');
    file = file.replace('___clientes', JSON.stringify({
      data: clientes,
      fecha_inicio: fecha_inicio,
      fecha_fin: fecha_fin,
      total_saldo: total_saldo
    }));

    file = file.replace('___empresa', JSON.stringify(empresa));
    file = file.replace('___token', JSON.stringify(token));
    res.send(file);
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let reporteCXCCliente = async (req, res) => {

  try {
    let token = req.query.token;
    let data = jwt.decode(token, key);

    let empresa = await Empresa.findOne({ where: { id: data.data.empresa_id } });

    let fecha_inicio = moment(req.query.fecha_inicio).format('YYYY-MM-DD HH:mm');
    let fecha_fin = moment(req.query.fecha_fin).format('YYYY-MM-DD HH:mm');

    let cliente = await Cliente.findOne({
      where: {
        id: req.params.id
      },
      include: [
        {
          model: Venta, as: 'ventas',
          where: {
            estado: 'VIGENTE',
            tipo_pago: 'CREDITO',
            fecha: {
              [Op.between]: [fecha_inicio, fecha_fin]
            }
          },
          include: [
            {
              model: Documento, as: 'documento',
            },
            {
              model: Saldo, as: 'saldos',
              limit: 1,
              order: [['id', 'DESC']]
            },
          ],
          required: false
        }
      ]
    });

    cliente = JSON.parse(JSON.stringify(cliente));

    let total_saldo = 0;

    for (let v = 0; v < cliente.ventas.length; v++) {
      if (cliente.ventas[v].saldos[0].saldo_final == 0) {
        cliente.ventas.splice(v, 1);
        v--;
      } else {
        total_saldo += parseFloat(cliente.ventas[v].saldos[0].saldo_final);
      }
    }

    let file = fs.readFileSync('./templates/cxc_cliente.html', 'utf8');
    file = file.replace('___cliente', JSON.stringify({
      data: cliente,
      fecha_inicio: fecha_inicio,
      fecha_fin: fecha_fin,
      total_saldo: total_saldo
    }));

    file = file.replace('___empresa', JSON.stringify(empresa));
    file = file.replace('___token', JSON.stringify(token));
    res.send(file);
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let reporteCXCClienteDetalle = async (req, res) => {

  try {
    let token = req.query.token;
    let data = jwt.decode(token, key);

    let empresa = await Empresa.findOne({ where: { id: data.data.empresa_id } });

    let fecha_inicio = moment(req.query.fecha_inicio).format('YYYY-MM-DD HH:mm');
    let fecha_fin = moment(req.query.fecha_fin).format('YYYY-MM-DD HH:mm');

    let cliente = await Cliente.findOne({
      where: {
        id: req.params.id
      },
      include: [
        {
          model: Saldo, as: 'saldos',
          // through: { 
          //   where: {
          //     saldo_acumulado: { [Op.gte]: 0 }
          //   }
          // },
          order: [['id', 'DESC']],
          include: [
            {
              model: Venta, as: 'venta',
              include: [
                {
                  model: Documento, as: 'documento',
                  include: [{ model: TipoDocumento, as: 'tipo_documento' }]
                }
              ],
              required: false
            },
            {
              model: Recibo, as: 'recibo',
              include: [
                {
                  model: Documento, as: 'documento',
                  include: [{ model: TipoDocumento, as: 'tipo_documento' }]
                }
              ],
              required: false
            },
            {
              model: Deposito, as: 'deposito',
              include: [
                {
                  model: Documento, as: 'documento',
                  include: [{ model: TipoDocumento, as: 'tipo_documento' }]
                }
              ],
              required: false
            },
            {
              model: NotaCredito, as: 'nota_credito',
              include: [
                {
                  model: Documento, as: 'documento',
                  include: [{ model: TipoDocumento, as: 'tipo_documento' }]
                }
              ],
              required: false
            },
            {
              model: NCCliente, as: 'nc_cliente',
              include: [
                {
                  model: Documento, as: 'documento',
                  include: [{ model: TipoDocumento, as: 'tipo_documento' }]
                }
              ],
              required: false
            },
            {
              model: NDCliente, as: 'nd_cliente',
              include: [
                {
                  model: Documento, as: 'documento',
                  include: [{ model: TipoDocumento, as: 'tipo_documento' }]
                }
              ],
              required: false
            }
          ]
        },
      ]
    });

    cliente = JSON.parse(JSON.stringify(cliente));


    let total_cargos = 0;
    let total_abonos = 0;
    let total_saldo = 0;

    for (let s = 0; s < cliente.saldos.length; s++) {
      if (cliente.saldos[s].tipo == 'cargo') {
        cliente.saldos[s].cargo = cliente.saldos[s].total;
        cliente.saldos[s].abono = 0;
      }

      if (cliente.saldos[s].tipo == 'abono') {
        cliente.saldos[s].abono = cliente.saldos[s].total;
        cliente.saldos[s].cargo = 0;

        cliente.saldos[s].liquida = 'DTE ' + cliente.saldos[s].venta.fel_numero;
        cliente.saldos[s].tipo_documento_liquida = cliente.saldos[s].venta.documento.tipo_documento;
      }

      if (cliente.saldos[s].venta && (cliente.saldos[s].deposito || cliente.saldos[s].recibo || cliente.saldos[s].nota_credito || cliente.saldos[s].nc_cliente || cliente.saldos[s].nd_cliente)) {
        cliente.saldos[s].liquida = 'DTE ' + cliente.saldos[s].venta.fel_numero;
      }

      if (cliente.saldos[s].venta) {
        cliente.saldos[s].fecha = cliente.saldos[s].estado == 'VIGENTE' ? moment(cliente.saldos[s].venta.fecha).format('DD/MM/YYYY HH:mm') : moment(cliente.saldos[s].venta.fecha_anulacion).format('DD/MM/YYYY HH:mm');
        cliente.saldos[s].no_doc = 'DTE ' + cliente.saldos[s].venta.fel_numero;
        cliente.saldos[s].tipo_documento = cliente.saldos[s].venta.documento.tipo_documento;
      }
      if (cliente.saldos[s].deposito) {
        cliente.saldos[s].fecha = cliente.saldos[s].estado == 'VIGENTE' ? moment(cliente.saldos[s].deposito.fecha).format('DD/MM/YYYY HH:mm') : moment(cliente.saldos[s].deposito.fecha_anulacion).format('DD/MM/YYYY HH:mm');
        cliente.saldos[s].no_doc = cliente.saldos[s].deposito.no_deposito;
        cliente.saldos[s].tipo_documento = cliente.saldos[s].deposito.documento.tipo_documento;
      }
      if (cliente.saldos[s].recibo) {
        cliente.saldos[s].fecha = cliente.saldos[s].estado == 'VIGENTE' ? moment(cliente.saldos[s].recibo.fecha).format('DD/MM/YYYY HH:mm') : moment(cliente.saldos[s].recibo.fecha_anulacion).format('DD/MM/YYYY HH:mm');
        cliente.saldos[s].no_doc = cliente.saldos[s].recibo.serie + '-' + cliente.saldos[s].recibo.correlativo;
        cliente.saldos[s].tipo_documento = cliente.saldos[s].recibo.documento.tipo_documento;
      }
      if (cliente.saldos[s].nota_credito) {
        cliente.saldos[s].fecha = cliente.saldos[s].estado == 'VIGENTE' ? moment(cliente.saldos[s].nota_credito.fecha).format('DD/MM/YYYY HH:mm') : moment(cliente.saldos[s].nota_credito.fecha_anulacion).format('DD/MM/YYYY HH:mm');
        cliente.saldos[s].no_doc = cliente.saldos[s].nota_credito.no_nc;
        cliente.saldos[s].tipo_documento = cliente.saldos[s].nota_credito.documento.tipo_documento;
      }
      if (cliente.saldos[s].nc_cliente) {
        cliente.saldos[s].fecha = cliente.saldos[s].estado == 'VIGENTE' ? moment(cliente.saldos[s].nc_cliente.fecha).format('DD/MM/YYYY HH:mm') : moment(cliente.saldos[s].nc_cliente.fecha_anulacion).format('DD/MM/YYYY HH:mm');
        cliente.saldos[s].no_doc = cliente.saldos[s].nc_cliente.no_nc;
        cliente.saldos[s].tipo_documento = cliente.saldos[s].nc_cliente.documento.tipo_documento;
      }
      if (cliente.saldos[s].nd_cliente) {
        cliente.saldos[s].fecha = cliente.saldos[s].estado == 'VIGENTE' ? moment(cliente.saldos[s].nd_cliente.fecha).format('DD/MM/YYYY HH:mm') : moment(cliente.saldos[s].nd_cliente.fecha_anulacion).format('DD/MM/YYYY HH:mm');
        cliente.saldos[s].no_doc = cliente.saldos[s].nd_cliente.no_nd;
        cliente.saldos[s].tipo_documento = cliente.saldos[s].nd_cliente.documento.tipo_documento;
      }

      total_cargos += parseFloat(cliente.saldos[s].cargo);
      total_abonos += parseFloat(cliente.saldos[s].abono);
    }

    total_saldo = total_cargos - total_abonos;


    let file = fs.readFileSync('./templates/cxc_detalle.html', 'utf8');
    file = file.replace('___cliente', JSON.stringify({
      data: cliente,
      fecha_inicio: fecha_inicio,
      fecha_fin: fecha_fin,
      total_cargos: total_cargos,
      total_abonos: total_abonos,
      total_saldo: total_saldo
    }));

    file = file.replace('___empresa', JSON.stringify(empresa));
    file = file.replace('___token', JSON.stringify(token));
    res.send(file);
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let createCliente = async (req, res) => {
  try {
    req.body.nombre = req.body.nombre.trim();
    req.body.nit = req.body.nit.trim();
    let cliente = await Cliente.findOne({ where: { nit: req.body.nit } });
    if (cliente) {
      await resp.error('El NIT ya existe', req, res);
    } else {
      let cliente = await Cliente.create(req.body);
      await resp.success({ mensaje: 'Cliente agregado', data: cliente }, req, res, 'Cliente');
    }
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let updateCliente = async (req, res) => {
  try {
    if (req.body.nombre) {
      req.body.nombre = req.body.nombre.trim();      
    }
    if (req.body.nit) {
      req.body.nit = req.body.nit.trim();
    }
    let cliente = await Cliente.update(req.body, { where: { id: req.params.id } });
    await resp.success({ mensaje: 'Cliente actualizado', data: cliente }, req, res, 'Cliente');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let deleteCliente = async (req, res) => {
  try {
    let cliente = await Cliente.destroy({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Cliente eliminado', data: cliente }, req, res, 'Cliente');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

export default {
  getAllClientes,
  getOneCliente,
  createCliente,
  updateCliente,
  deleteCliente,
  reporteCXC,
  reporteCXCCliente,
  reporteCXCClienteDetalle,
}