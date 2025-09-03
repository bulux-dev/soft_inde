import fl from '../../../middleware/filtros.js';
import resp from '../../../middleware/resp.js';
import ProductoMedida from './productos_medidas.model.js';

let getAllProductosMedidas = async (req, res) => {
  try {
    let where = fl(req.query);
    let productos_medidas = await ProductoMedida.findAll({
      where: where,
    });
    await resp.success({ mensaje: 'Productos Medidas encontradas', data: productos_medidas }, req, res, 'Producto Medida');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getOneProductoMedida = async (req, res) => {
  try {
    let producto_medida = await ProductoMedida.findOne({
      where: { id: req.params.id }
    });
    await resp.success({ mensaje: 'Producto Medida encontrado', data: producto_medida }, req, res, 'Producto Medida');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let createProductoMedida = async (req, res) => {
  try {
    let producto_medida = await ProductoMedida.findOne({ where: { producto_id: req.body.producto_id, medida_id: req.body.medida_id } });
    if (producto_medida) {
      return resp.error('Medida ya asignada', req, res, 'Producto Medida');
    } else {
      producto_medida = await ProductoMedida.create(req.body);
      await resp.success({ mensaje: 'Producto Medida agregada', data: producto_medida }, req, res, 'Producto Medida');
    }
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let updateProductoMedida = async (req, res) => {
  try {
    let producto_medida = await ProductoMedida.update(req.body, { where: { id: req.params.id } });
    await resp.success({ mensaje: 'Producto Medida actualizada', data: producto_medida }, req, res, 'Producto Medida');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let deleteProductoMedida = async (req, res) => {
  try {
    let producto_medida = await ProductoMedida.destroy({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Producto Medida eliminada', data: producto_medida }, req, res, 'Producto Medida');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

export default {
  getAllProductosMedidas,
  getOneProductoMedida,
  createProductoMedida,
  updateProductoMedida,
  deleteProductoMedida
}