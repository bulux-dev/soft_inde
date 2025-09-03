import fl from '../../../middleware/filtros.js';
import resp from '../../../middleware/resp.js';
import ProductoFoto from './productos_fotos.model.js';

let getAllProductosFotos = async (req, res) => {
  try {
    let where = fl(req.query);
    let productos_fotos = await ProductoFoto.findAll({
      where: where,
    });
    await resp.success({ mensaje: 'Fotos encontradas', data: productos_fotos }, req, res, 'Producto Foto');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getOneProductoFoto = async (req, res) => {
  try {
    let producto_foto = await ProductoFoto.findOne({
      where: { id: req.params.id }
    });
    await resp.success({ mensaje: 'Foto encontrados', data: producto_foto }, req, res, 'Producto Foto');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let createProductoFoto = async (req, res) => {
  try {
    let producto_foto = await ProductoFoto.findOne({ where: { producto_id: req.body.producto_id, foto: req.body.foto } });
    if (producto_foto) {
      return resp.error('Foto ya asignada', req, res, 'Producto Foto');
    } else {
      producto_foto = await ProductoFoto.create(req.body);
      await resp.success({ mensaje: 'Foto agregada', data: producto_foto }, req, res, 'Producto Foto');
    }
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let updateProductoFoto = async (req, res) => {
  try {
    let producto_foto = await ProductoFoto.update(req.body, { where: { id: req.params.id } });
    await resp.success({ mensaje: 'Foto actualizada', data: producto_foto }, req, res, 'Producto Foto');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let deleteProductoFoto = async (req, res) => {
  try {
    let producto_foto = await ProductoFoto.destroy({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Foto eliminada', data: producto_foto }, req, res, 'Producto Foto');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

export default {
  getAllProductosFotos,
  getOneProductoFoto,
  createProductoFoto,
  updateProductoFoto,
  deleteProductoFoto
}