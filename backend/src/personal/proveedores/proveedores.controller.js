import fl from '../../../middleware/filtros.js';
import resp from '../../../middleware/resp.js';
import Proveedor from './proveedores.model.js';
import Saldo from '../../facturacion/saldos/saldos.model.js';
import key from '../../../middleware/key.js';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import { Op, where } from 'sequelize';
import moment from 'moment';
import Documento from '../../facturacion/documentos/documentos.model.js';
import Compra from '../../facturacion/compras/compras.model.js';
import NCProveedor from '../../facturacion/nc_proveedores/nc_proveedores.model.js';
import NDProveedor from '../../facturacion/nd_proveedores/nd_proveedores.model.js';
import Empresa from '../../empresas/empresas.model.js';
import TipoDocumento from '../../facturacion/tipos_documentos/tipos_documentos.model.js';
import Cheque from '../../finanzas/cheques/cheques.model.js';
import NotaDebito from '../../finanzas/notas_debitos/notas_debitos.model.js';
import Importacion from '../../facturacion/importaciones/importaciones.model.js';

let getAllProveedores = async (req, res) => {
  try {
    let where = fl(req.query);
    let proveedores = await Proveedor.findAll({
      where: where,
    });
    await resp.success({ mensaje: 'Proveedores encontrados', data: proveedores }, req, res, 'Proveedor');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getOneProveedor = async (req, res) => {
  try {
    let proveedor = await Proveedor.findOne({
      where: { id: req.params.id },
    });
    await resp.success({ mensaje: 'Proveedor encontrado', data: proveedor }, req, res, 'Proveedor');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let reporteCXP = async (req, res) => {
  try {
    let token = req.query.token;
    let data = jwt.decode(token, key);

    let empresa = await Empresa.findOne({ where: { id: data.data.empresa_id } });

    let fecha_inicio = moment(req.query.fecha_inicio).format('YYYY-MM-DD HH:mm');
    let fecha_fin = moment(req.query.fecha_fin).format('YYYY-MM-DD HH:mm');

    let proveedores = await Proveedor.findAll({
      include: [
        {
          model: Saldo, as: 'saldos',
          limit: 1,
          order: [['id', 'DESC']],
          required: true
        },
      ]
    });

    proveedores = JSON.parse(JSON.stringify(proveedores));

    proveedores = proveedores.filter(c => c.saldos.length > 0 && parseFloat(c.saldos[0].saldo_acumulado).toFixed(2) > 0);

    let total_saldo = 0;

    for (let c = 0; c < proveedores.length; c++) {
      for (let v = 0; v < proveedores[c].saldos.length; v++) {
        total_saldo += parseFloat(proveedores[c].saldos[0].saldo_acumulado);
      }
    }

    let file = fs.readFileSync('./templates/cxp.html', 'utf8');
    file = file.replace('___proveedores', JSON.stringify({
      data: proveedores,
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

let reporteCXPProveedor = async (req, res) => {

  try {
    let token = req.query.token;
    let data = jwt.decode(token, key);

    let empresa = await Empresa.findOne({ where: { id: data.data.empresa_id } });

    let fecha_inicio = moment(req.query.fecha_inicio).format('YYYY-MM-DD HH:mm');
    let fecha_fin = moment(req.query.fecha_fin).format('YYYY-MM-DD HH:mm');

    let proveedor = await Proveedor.findOne({
      where: {
        id: req.params.id
      },
      include: [
        {
          model: Compra, as: 'compras',
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

    proveedor = JSON.parse(JSON.stringify(proveedor));

    let total_saldo = 0;

    for (let v = 0; v < proveedor.compras.length; v++) {
      if (proveedor.compras[v].saldos[0].saldo_final == 0) {
        proveedor.compras.splice(v, 1);
        v--;
      } else {
        total_saldo += parseFloat(proveedor.compras[v].saldos[0].saldo_final);
      }
    }

    let file = fs.readFileSync('./templates/cxp_proveedor.html', 'utf8');
    file = file.replace('___proveedor', JSON.stringify({
      data: proveedor,
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

let reporteCXPProveedorDetalle = async (req, res) => {

  try {
    let token = req.query.token;
    let data = jwt.decode(token, key);

    let empresa = await Empresa.findOne({ where: { id: data.data.empresa_id } });

    let fecha_inicio = moment(req.query.fecha_inicio).format('YYYY-MM-DD HH:mm');
    let fecha_fin = moment(req.query.fecha_fin).format('YYYY-MM-DD HH:mm');

    let proveedor = await Proveedor.findOne({
      where: {
        id: req.params.id
      },
      include: [
        {
          model: Saldo, as: 'saldos',
          order: [['id', 'DESC']],
          include: [
            {
              model: Compra, as: 'compra',
              include: [
                {
                  model: Documento, as: 'documento',
                  include: [{ model: TipoDocumento, as: 'tipo_documento' }]
                }
              ],
              required: false
            },
            {
              model: Importacion, as: 'importacion',
              include: [
                {
                  model: Documento, as: 'documento',
                  include: [{ model: TipoDocumento, as: 'tipo_documento' }]
                }
              ],
              required: false
            },
            {
              model: Cheque, as: 'cheque',
              include: [
                {
                  model: Documento, as: 'documento',
                  include: [{ model: TipoDocumento, as: 'tipo_documento' }]
                }
              ],
            },
            {
              model: NotaDebito, as: 'nota_debito',
              include: [
                {
                  model: Documento, as: 'documento',
                  include: [{ model: TipoDocumento, as: 'tipo_documento' }]
                }
              ]
            },
            {
              model: NCProveedor, as: 'nc_proveedor',
              include: [
                {
                  model: Documento, as: 'documento',
                  include: [{ model: TipoDocumento, as: 'tipo_documento' }]
                }
              ],
              required: false
            },
            {
              model: NDProveedor, as: 'nd_proveedor',
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

    proveedor = JSON.parse(JSON.stringify(proveedor));


    let total_cargos = 0;
    let total_abonos = 0;
    let total_saldo = 0;

    for (let s = 0; s < proveedor.saldos.length; s++) {
      if (proveedor.saldos[s].tipo == 'cargo') {
        proveedor.saldos[s].cargo = proveedor.saldos[s].total;
        proveedor.saldos[s].abono = 0;
      }

      if (proveedor.saldos[s].tipo == 'abono') {
        proveedor.saldos[s].abono = proveedor.saldos[s].total;
        proveedor.saldos[s].cargo = 0;

        if (proveedor.saldos[s].compra) {
          proveedor.saldos[s].liquida = proveedor.saldos[s].compra.no_doc;
          proveedor.saldos[s].tipo_documento_liquida = proveedor.saldos[s].compra.documento.tipo_documento;
        }
        if (proveedor.saldos[s].importacion) {
          proveedor.saldos[s].liquida = proveedor.saldos[s].importacion.no_cheque;
          proveedor.saldos[s].tipo_documento_liquida = proveedor.saldos[s].importacion.documento.tipo_documento;
        }
      }

      if (proveedor.saldos[s].compra && (proveedor.saldos[s].cheque || proveedor.saldos[s].nota_debito || proveedor.saldos[s].nc_proveedor || proveedor.saldos[s].nd_proveedor)) {
        proveedor.saldos[s].liquida = proveedor.saldos[s].compra.no_doc;
      }

      if (proveedor.saldos[s].importacion && (proveedor.saldos[s].cheque || proveedor.saldos[s].nota_debito || proveedor.saldos[s].nc_proveedor || proveedor.saldos[s].nd_proveedor)) {
        proveedor.saldos[s].liquida = proveedor.saldos[s].importacion.no_doc;
      }

      if (proveedor.saldos[s].compra) {
        proveedor.saldos[s].fecha = proveedor.saldos[s].estado == 'VIGENTE' ? moment(proveedor.saldos[s].compra.fecha).format('DD/MM/YYYY HH:mm') : moment(proveedor.saldos[s].compra.fecha_anulacion).format('DD/MM/YYYY HH:mm');
        proveedor.saldos[s].no_doc = proveedor.saldos[s].compra.no_doc;
        proveedor.saldos[s].tipo_documento = proveedor.saldos[s].compra.documento.tipo_documento;
      }
      if (proveedor.saldos[s].cheque) {
        proveedor.saldos[s].fecha = proveedor.saldos[s].estado == 'VIGENTE' ? moment(proveedor.saldos[s].cheque.fecha).format('DD/MM/YYYY HH:mm') : moment(proveedor.saldos[s].cheque.fecha_anulacion).format('DD/MM/YYYY HH:mm');
        proveedor.saldos[s].no_doc = proveedor.saldos[s].cheque.no_cheque;
        proveedor.saldos[s].tipo_documento = proveedor.saldos[s].cheque.documento.tipo_documento;
      }
      if (proveedor.saldos[s].nota_debito) {
        proveedor.saldos[s].fecha = proveedor.saldos[s].estado == 'VIGENTE' ? moment(proveedor.saldos[s].nota_debito.fecha).format('DD/MM/YYYY HH:mm') : moment(proveedor.saldos[s].nota_debito.fecha_anulacion).format('DD/MM/YYYY HH:mm');
        proveedor.saldos[s].no_doc = proveedor.saldos[s].nota_debito.no_nd;
        proveedor.saldos[s].tipo_documento = proveedor.saldos[s].nota_debito.documento.tipo_documento;
      }
      if (proveedor.saldos[s].nc_proveedor) {
        proveedor.saldos[s].fecha = proveedor.saldos[s].estado == 'VIGENTE' ? moment(proveedor.saldos[s].nc_proveedor.fecha).format('DD/MM/YYYY HH:mm') : moment(proveedor.saldos[s].nc_proveedor.fecha_anulacion).format('DD/MM/YYYY HH:mm');
        proveedor.saldos[s].no_doc = proveedor.saldos[s].nc_proveedor.no_nc;
        proveedor.saldos[s].tipo_documento = proveedor.saldos[s].nc_proveedor.documento.tipo_documento;
      }
      if (proveedor.saldos[s].nd_proveedor) {
        proveedor.saldos[s].fecha = proveedor.saldos[s].estado == 'VIGENTE' ? moment(proveedor.saldos[s].nd_proveedor.fecha).format('DD/MM/YYYY HH:mm') : moment(proveedor.saldos[s].nd_proveedor.fecha_anulacion).format('DD/MM/YYYY HH:mm');
        proveedor.saldos[s].no_doc = proveedor.saldos[s].nd_proveedor.no_nd;
        proveedor.saldos[s].tipo_documento = proveedor.saldos[s].nd_proveedor.documento.tipo_documento;
      }

      total_cargos += parseFloat(proveedor.saldos[s].cargo);
      total_abonos += parseFloat(proveedor.saldos[s].abono);
    }

    total_saldo = total_cargos - total_abonos;


    let file = fs.readFileSync('./templates/cxp_detalle.html', 'utf8');
    file = file.replace('___proveedor', JSON.stringify({
      data: proveedor,
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

let createProveedor = async (req, res) => {
  try {
    req.body.nombre = req.body.nombre.trim();
    req.body.nit = req.body.nit.trim();
    let proveedor = await Proveedor.findOne({ where: { nit: req.body.nit } });
    if (proveedor) {
      await resp.error('El NIT ya existe', req, res);
    } else {
      let proveedor = await Proveedor.create(req.body);
      await resp.success({ mensaje: 'Proveedor agregado', data: proveedor }, req, res, 'Proveedor');
    }
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let updateProveedor = async (req, res) => {
  try {
    if (req.body.nombre) {
      req.body.nombre = req.body.nombre.trim();
    }
    if (req.body.nit) {
      req.body.nit = req.body.nit.trim();
    }
    let proveedor = await Proveedor.update(req.body, { where: { id: req.params.id } });
    await resp.success({ mensaje: 'Proveedor actualizado', data: proveedor }, req, res, 'Proveedor');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let deleteProveedor = async (req, res) => {
  try {
    let proveedor = await Proveedor.destroy({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Proveedor eliminado', data: proveedor }, req, res, 'Proveedor');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

export default {
  getAllProveedores,
  getOneProveedor,
  createProveedor,
  updateProveedor,
  deleteProveedor,
  reporteCXP,
  reporteCXPProveedor,
  reporteCXPProveedorDetalle,
}