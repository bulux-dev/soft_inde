import fl from '../../../middleware/filtros.js';
import resp from '../../../middleware/resp.js';
import Cliente from '../../personal/clientes/clientes.model.js';
import NCCliente from '../../facturacion/nc_clientes/nc_clientes.model.js';
import NDCliente from '../../facturacion/nd_clientes/nd_clientes.model.js';
import NCProveedor from '../../facturacion/nc_proveedores/nc_proveedores.model.js';
import NDProveedor from '../../facturacion/nd_proveedores/nd_proveedores.model.js';
import Cheque from '../../finanzas/cheques/cheques.model.js';
import Compra from '../compras/compras.model.js';
import Deposito from '../../finanzas/depositos/depositos.model.js';
import Documento from '../documentos/documentos.model.js';
import NotaCredito from '../../finanzas/notas_creditos/notas_creditos.model.js';
import NotaDebito from '../../finanzas/notas_debitos/notas_debitos.model.js';
import Recibo from '../recibos/recibos.model.js';
import Venta from '../ventas/ventas.model.js';
import Saldo from './saldos.model.js';
import Proveedor from '../../personal/proveedores/proveedores.model.js';

let getAllSaldos = async (req, res) => {
  try {
    let where = fl(req.query);
    let saldos = await Saldo.findAll({
      where: where,
    });
    await resp.success({ mensaje: 'Saldos encontradas', data: saldos }, req, res, 'Saldo');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getAllSaldosCXC = async (req, res) => {
  try {
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
    clientes = clientes.filter(c => c.saldos.length > 0 && parseFloat(c.saldos[0].saldo_acumulado).toFixed(2) > 0);
    await resp.success({ mensaje: 'Saldos encontrados', data: clientes }, req, res, 'Saldo');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getAllSaldosCXCCliente = async (req, res) => {
  try {
    let where = fl(req.query);
    where.cliente_id = req.params.cliente_id;
    let saldos = await Saldo.findAll({
      where: where,
      include: [
        {
          model: Venta, as: 'venta',
          include: [
            {
              model: Documento, as: 'documento',
            }
          ],
          required: false
        },
        {
          model: Recibo, as: 'recibo',
          include: [
            {
              model: Documento, as: 'documento',
            }
          ],
          required: false
        },
        {
          model: Deposito, as: 'deposito',
          include: [
            {
              model: Documento, as: 'documento',
            }
          ],
          required: false
        },
        {
          model: NotaCredito, as: 'nota_credito',
          include: [
            {
              model: Documento, as: 'documento',
            }
          ],
          required: false
        },
        {
          model: NCCliente, as: 'nc_cliente',
          include: [
            {
              model: Documento, as: 'documento',
            }
          ],
          required: false
        },
        {
          model: NDCliente, as: 'nd_cliente',
          include: [
            {
              model: Documento, as: 'documento',
            }
          ],
          required: false
        }
      ]
    });
    await resp.success({ mensaje: 'Saldos encontrados', data: saldos }, req, res, 'Saldo');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getAllSaldosCXCAcum = async (req, res) => {
  try {
    let acum = await Saldo.findOne({
      where: { cliente_id: req.params.cliente_id },
      limit: 1,
      order: [['id', 'DESC']]
    });
    await resp.success({ mensaje: 'Saldos encontradas', data: acum }, req, res, 'Saldo');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getAllSaldosCXP = async (req, res) => {
  try {
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
    proveedores = proveedores.filter(c => c.saldos.length > 0 && parseFloat(c.saldos[0].saldo_acumulado).toFixed(2) > 0);
    await resp.success({ mensaje: 'Saldos encontrados', data: proveedores }, req, res, 'Saldo');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getAllSaldosCXPProveedor = async (req, res) => {
  try {
    let where = fl(req.query);
    where.proveedor_id = req.params.proveedor_id
    let saldos = await Saldo.findAll({
      where: where,
      include: [
        {
          model: Compra, as: 'compra',
          include: [
            {
              model: Documento, as: 'documento',
            }
          ],
          required: false
        },
        {
          model: Cheque, as: 'cheque',
          include: [
            {
              model: Documento, as: 'documento',
            }
          ],
          required: false
        },
        {
          model: NotaDebito, as: 'nota_debito',
          include: [
            {
              model: Documento, as: 'documento',
            }
          ],
          required: false
        },
        {
          model: NDProveedor, as: 'nd_proveedor',
          include: [
            {
              model: Documento, as: 'documento',
            }
          ],
          required: false
        },
        {
          model: NCProveedor, as: 'nc_proveedor',
          include: [
            {
              model: Documento, as: 'documento',
            }
          ],
          required: false
        }
      ]
    });
    await resp.success({ mensaje: 'Saldos encontrados', data: saldos }, req, res, 'Saldo');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getAllSaldosCXPAcum = async (req, res) => {
  try {
    let acum = await Saldo.findOne({
      where: { proveedor_id: req.params.proveedor_id },
      limit: 1,
      order: [['id', 'DESC']]
    });
    await resp.success({ mensaje: 'Saldos encontradas', data: acum }, req, res, 'Saldo');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getOneSaldo = async (req, res) => {
  try {
    let saldo = await Saldo.findOne({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Saldo encontrada', data: saldo }, req, res, 'Saldo');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let createSaldo = async (req, res) => {
  try {
    let saldo = await Saldo.create(req.body);
    await resp.success({ mensaje: 'Saldo agregado', data: saldo }, req, res, 'Saldo');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let updateSaldo = async (req, res) => {
  try {
    let saldo = await Saldo.update(req.body, { where: { id: req.params.id } });
    await resp.success({ mensaje: 'Saldo actualizado', data: saldo }, req, res, 'Saldo');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let deleteSaldo = async (req, res) => {
  try {
    let saldo = await Saldo.destroy({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Saldo eliminado', data: saldo }, req, res, 'Saldo');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

export default {
  getAllSaldos,
  getAllSaldosCXC,
  getAllSaldosCXCCliente,
  getAllSaldosCXCAcum,
  getAllSaldosCXP,
  getAllSaldosCXPProveedor,
  getAllSaldosCXPAcum,
  getOneSaldo,
  createSaldo,
  updateSaldo,
  deleteSaldo
}