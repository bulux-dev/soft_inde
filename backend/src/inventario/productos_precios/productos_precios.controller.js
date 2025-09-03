import fl from '../../../middleware/filtros.js';
import resp from '../../../middleware/resp.js';
import ProductoPrecio from './productos_precios.model.js';

let getAllProductosPrecios = async (req, res) => {
  try {
    let where = fl(req.query);
    let productos_precios = await ProductoPrecio.findAll({
      where: where
    });
    await resp.success({ mensaje: 'Productos Precios encontrados', data: productos_precios }, req, res, 'Producto Precio');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getOneProductoPrecio = async (req, res) => {
  try {
    let producto_precio = await ProductoPrecio.findOne({
      where: { id: req.params.id }
    });
    await resp.success({ mensaje: 'Producto Precio encontrado', data: producto_precio }, req, res, 'Producto Precio');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let createProductoPrecio = async (req, res) => {
  try {
    let producto_precio = await ProductoPrecio.findOne({ where: { nombre: req.body.nombre } });
    if (producto_precio) {
      return resp.error('Producto Precio ya existente', req, res, 'Producto Precio');
    } else {
      producto_precio = await ProductoPrecio.create(req.body);
      await resp.success({ mensaje: 'Producto Precio agregado', data: producto_precio }, req, res, 'Producto Precio');
    }
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let updateProductoPrecio = async (req, res) => {
  try {
    let producto_precio = await ProductoPrecio.update(req.body, { where: { id: req.params.id } });
    await resp.success({ mensaje: 'Producto Precio actualizado', data: producto_precio }, req, res, 'Producto Precio');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let deleteProductoPrecio = async (req, res) => {
  try {
    let producto_precio = await ProductoPrecio.destroy({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Producto Precio eliminado', data: producto_precio }, req, res, 'Producto Precio');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

export default {
  getAllProductosPrecios,
  getOneProductoPrecio,
  createProductoPrecio,
  updateProductoPrecio,
  deleteProductoPrecio
}