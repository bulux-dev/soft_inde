import fl from '../../../middleware/filtros.js';
import resp from '../../../middleware/resp.js';
import Etiqueta from './etiquetas.model.js';
import OperacionEtiqueta from '../operaciones_etiquetas/operaciones_etiquetas.model.js';
import Compra from '../../facturacion/compras/compras.model.js';
import Venta from '../../facturacion/ventas/ventas.model.js';
import Proveedor from '../../personal/proveedores/proveedores.model.js';
import Cliente from '../../personal/clientes/clientes.model.js';
import Moneda from '../../facturacion/monedas/monedas.model.js';
import Saldo from '../../facturacion/saldos/saldos.model.js';

let getAllEtiquetas = async (req, res) => {
  try {
    let where = fl(req.query);
    let etiquetas = await Etiqueta.findAll({
      where: where
    });
    await resp.success({ mensaje: 'Etiquetas encontradas', data: etiquetas }, req, res, 'Etiqueta');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getOneEtiqueta = async (req, res) => {
  try {
    let etiqueta = await Etiqueta.findOne({ 
      where: { id: req.params.id },
      include: [
        {
          model: OperacionEtiqueta, as: 'operaciones_etiquetas',
          include: [
            {
              model: Compra, as: 'compra',
              include: [
                {
                  model: Proveedor, as: 'proveedor'
                },
                {
                  model: Moneda, as: 'moneda'
                },
                {
                  model: Saldo, as: 'saldos',
                  limit: 1,
                  order: [['id', 'DESC']],
                },
              ]
            },
            {
              model: Venta, as: 'venta',
              include: [
                {
                  model: Cliente, as: 'cliente'
                },
                {
                  model: Moneda, as: 'moneda'
                },
                {
                  model: Saldo, as: 'saldos',
                  limit: 1,
                  order: [['id', 'DESC']],
                },
              ]
            }
          ]
        }
      ]
    });
    await resp.success({ mensaje: 'Etiqueta encontrada', data: etiqueta }, req, res, 'Etiqueta');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let createEtiqueta = async (req, res) => {
  try {
    let etiqueta = await Etiqueta.create(req.body);
    etiqueta.id = etiqueta.null;
    await resp.success({ mensaje: 'Etiqueta agregada', data: etiqueta }, req, res, 'Etiqueta');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let updateEtiqueta = async (req, res) => {
  try {
    let etiqueta = await Etiqueta.update(req.body, { where: { id: req.params.id } });
    await resp.success({ mensaje: 'Etiqueta actualizada', data: etiqueta }, req, res, 'Etiqueta');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let deleteEtiqueta = async (req, res) => {
  try {
    let etiqueta = await Etiqueta.destroy({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Etiqueta eliminada', data: etiqueta }, req, res, 'Etiqueta');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

export default {
  getAllEtiquetas,
  getOneEtiqueta,
  createEtiqueta,
  updateEtiqueta,
  deleteEtiqueta
}