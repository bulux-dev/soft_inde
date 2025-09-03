import fl from '../../../middleware/filtros.js';
import resp from '../../../middleware/resp.js';
import ProductoCategoria from './productos_categorias.model.js';

let getAllProductosCategorias = async (req, res) => {
  try {
    let where = fl(req.query);
    let productos_categorias = await ProductoCategoria.findAll({
      where: where,
    });
    await resp.success({ mensaje: 'Productos Categorias encontrados', data: productos_categorias }, req, res, 'Producto Categoria');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getOneProductoCategoria = async (req, res) => {
  try {
    let producto_categoria = await ProductoCategoria.findOne({
      where: { id: req.params.id }
    });
    await resp.success({ mensaje: 'Producto Categoria encontrado', data: producto_categoria }, req, res, 'Producto Categoria');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let createProductoCategoria = async (req, res) => {
  try {
    let producto_categoria = await ProductoCategoria.findOne({ where: { producto_id: req.body.producto_id, categoria_id: req.body.categoria_id } });
    if (producto_categoria) {
      return resp.error('Categoria ya asignada', req, res, 'Producto Categoria');
    } else {
      producto_categoria = await ProductoCategoria.create(req.body);
      await resp.success({ mensaje: 'Producto Categoria agregado', data: producto_categoria }, req, res, 'Producto Categoria');
    }
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let updateProductoCategoria = async (req, res) => {
  try {
    let producto_categoria = await ProductoCategoria.update(req.body, { where: { id: req.params.id } });
    await resp.success({ mensaje: 'Producto Categoria actualizado', data: producto_categoria }, req, res, 'Producto Categoria');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let deleteProductoCategoria = async (req, res) => {
  try {
    let producto_categoria = await ProductoCategoria.destroy({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Producto Categoria eliminado', data: producto_categoria }, req, res, 'Producto Categoria');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

export default {
  getAllProductosCategorias,
  getOneProductoCategoria,
  createProductoCategoria,
  updateProductoCategoria,
  deleteProductoCategoria
}