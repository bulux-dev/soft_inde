import fl from '../../../middleware/filtros.js';
import resp from '../../../middleware/resp.js';
import Compra from '../../facturacion/compras/compras.model.js';
import Importacion from '../../facturacion/importaciones/importaciones.model.js';
import ProductoCosto from './productos_costos.model.js';

let getAllProductosCostos = async (req, res) => {
  try {
    let where = fl(req.query);
    let productos_costos = await ProductoCosto.findAll({
      where: where,
      include: [
        { model: Compra, as: 'compra' },
        { model: Importacion, as: 'importacion' }
      ]
    });
    await resp.success({ mensaje: 'Productos Costos encontrados', data: productos_costos }, req, res, 'Producto Costo');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getOneProductoCosto = async (req, res) => {
  try {
    let producto_costo = await ProductoCosto.findOne({
      where: { id: req.params.id }
    });
    await resp.success({ mensaje: 'Producto Costo encontrado', data: producto_costo }, req, res, 'Producto Costo');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let createProductoCosto = async (req, res) => {
  try {
    let producto_costo = await ProductoCosto.findOne({ where: { producto_id: req.body.producto_id, costo_id: req.body.costo_id } });
    if (producto_costo) {
      return resp.error('Costo ya asignada', req, res, 'Producto Costo');
    } else {
      producto_costo = await ProductoCosto.create(req.body);
      await resp.success({ mensaje: 'Producto Costo agregado', data: producto_costo }, req, res, 'Producto Costo');
    }
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let updateProductoCosto = async (req, res) => {
  try {
    let producto_costo = await ProductoCosto.update(req.body, { where: { id: req.params.id } });
    await resp.success({ mensaje: 'Producto Costo actualizado', data: producto_costo }, req, res, 'Producto Costo');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let deleteProductoCosto = async (req, res) => {
  try {
    let producto_costo = await ProductoCosto.destroy({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Producto Costo eliminado', data: producto_costo }, req, res, 'Producto Costo');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

export default {
  getAllProductosCostos,
  getOneProductoCosto,
  createProductoCosto,
  updateProductoCosto,
  deleteProductoCosto
}