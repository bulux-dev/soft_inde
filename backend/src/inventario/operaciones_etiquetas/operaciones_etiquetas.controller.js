import fl from '../../../middleware/filtros.js';
import resp from '../../../middleware/resp.js';
import Etiqueta from '../etiquetas/etiquetas.model.js';
import OperacionEtiqueta from './operaciones_etiquetas.model.js';

let getAllOperacionesEtiquetas = async (req, res) => {
  try {
    let where = fl(req.query);
    let operaciones_etiquetas = await OperacionEtiqueta.findAll({
      where: where,
      include: [
        {
          model: Etiqueta, as: 'etiqueta'
        }
      ]
    });
    await resp.success({ mensaje: 'Operaciones Etiquetas encontrados', data: operaciones_etiquetas }, req, res, 'Operacion Etiqueta');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getOneOperacionEtiqueta = async (req, res) => {
  try {
    let operacion_etiqueta = await OperacionEtiqueta.findOne({
      where: { id: req.params.id }
    });
    await resp.success({ mensaje: 'Etiqueta encontrada', data: operacion_etiqueta }, req, res, 'Operacion Etiqueta');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let createOperacionEtiqueta = async (req, res) => {
  try {
    let operacion_etiqueta = await OperacionEtiqueta.findOne({ where: { producto_id: req.body.producto_id, categoria_id: req.body.categoria_id } });
    if (operacion_etiqueta) {
      return resp.error('Categoria ya asignada', req, res, 'Operacion Etiqueta');
    } else {
      operacion_etiqueta = await OperacionEtiqueta.create(req.body);
      await resp.success({ mensaje: 'Etiqueta agregada', data: operacion_etiqueta }, req, res, 'Operacion Etiqueta');
    }
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let updateOperacionEtiqueta = async (req, res) => {
  try {

    let where = {};
    if (req.body.operacion == 'compra') {
      where = { compra_id: req.params.id };      
    }
    if (req.body.operacion == 'venta') {
      where = { venta_id: req.params.id };
    }
    if (req.body.operacion == 'orden_compra') {
      where = { orden_compra_id: req.params.id };
    }
    if (req.body.operacion == 'cotizacion') {
      where = { cotizacion_id: req.params.id };
    }
    if (req.body.operacion == 'pedido') {
      where = { pedido_id: req.params.id };
    }
    if (req.body.operacion == 'envio') {
      where = { envio_id: req.params.id };
    }
    if (req.body.operacion == 'carga') {
      where = { carga_id: req.params.id };
    }
    if (req.body.operacion == 'descarga') {
      where = { descarga_id: req.params.id };
    }
    if (req.body.operacion == 'traslado') {
      where = { traslado_id: req.params.id };
    } 
    if (req.body.operacion == 'nc_cliente') {
      where = { nc_cliente_id: req.params.id };
    }   
    if (req.body.operacion == 'nd_cliente') {
      where = { nd_cliente_id: req.params.id };
    }
    if (req.body.operacion == 'nc_proveedor') {
      where = { nc_proveedor_id: req.params.id };
    }
    if (req.body.operacion == 'nd_proveedor') {
      where = { nd_proveedor_id: req.params.id };
    }
    if (req.body.operacion == 'recibo') {
      where = { recibo_id: req.params.id };
    }
    if (req.body.operacion == 'cheque') {
      where = { cheque_id: req.params.id };
    }
    if (req.body.operacion == 'deposito') {
      where = { deposito_id: req.params.id };
    }
    if (req.body.operacion == 'nota_credito') {
      where = { nota_credito_id: req.params.id };
    }
    if (req.body.operacion == 'nota_debito') {
      where = { nota_debito_id: req.params.id };
    }

    let etiquetas = JSON.parse(JSON.stringify(await OperacionEtiqueta.findAll({ where: where })))
    let operaciones_etiquetas = JSON.parse(JSON.stringify(req.body.operaciones_etiquetas));

    for (let oe = 0; oe < operaciones_etiquetas.length; oe++) {
      for (let e = 0; e < etiquetas.length; e++) {
        if (etiquetas[e].categoria_id == operaciones_etiquetas[oe].id) {
          etiquetas.splice(e, 1);
          operaciones_etiquetas.splice(oe, 1);
          e++;
        }
      }
    }

    for (let e = 0; e < etiquetas.length; e++) {
      await OperacionEtiqueta.destroy({ where: { id: etiquetas[e].id } });
    }

    for (let p = 0; p < operaciones_etiquetas.length; p++) {
      where.etiqueta_id = operaciones_etiquetas[p].id;
      await OperacionEtiqueta.upsert(where);
    }

    await resp.success({ mensaje: 'Etiqueta actualizada', data: operaciones_etiquetas }, req, res, 'Operacion Etiqueta');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let deleteOperacionEtiqueta = async (req, res) => {
  try {
    let operacion_etiqueta = await OperacionEtiqueta.destroy({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Etiqueta eliminada', data: operacion_etiqueta }, req, res, 'Operacion Etiqueta');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

export default {
  getAllOperacionesEtiquetas,
  getOneOperacionEtiqueta,
  createOperacionEtiqueta,
  updateOperacionEtiqueta,
  deleteOperacionEtiqueta
}