import fl from '../../../middleware/filtros.js';
import resp from '../../../middleware/resp.js';
import TipoProducto from './tipos_productos.model.js';

let getAllTiposProductos = async (req, res) => {
  try {
    let where = fl(req.query);
    let tipos_productos = await TipoProducto.findAll({
      where: where,
    });
    await resp.success({ mensaje: 'TiposProductos encontrados', data: tipos_productos }, req, res, 'TipoProducto');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getOneTipoProducto = async (req, res) => {
  try {
    let tipo_producto = await TipoProducto.findOne({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'TipoProducto encontrado', data: tipo_producto }, req, res, 'TipoProducto');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let createTipoProducto = async (req, res) => {
  try {
    let tipo_producto = await TipoProducto.create(req.body);
    await resp.success({ mensaje: 'TipoProducto agregado', data: tipo_producto }, req, res, 'TipoProducto');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let updateTipoProducto = async (req, res) => {
  try {
    let tipo_producto = await TipoProducto.update(req.body, { where: { id: req.params.id } });
    await resp.success({ mensaje: 'TipoProducto actualizado', data: tipo_producto }, req, res, 'TipoProducto');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let deleteTipoProducto = async (req, res) => {
  try {
    let tipo_producto = await TipoProducto.destroy({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'TipoProducto eliminado', data: tipo_producto }, req, res, 'TipoProducto');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

export default {
  getAllTiposProductos,
  getOneTipoProducto,
  createTipoProducto,
  updateTipoProducto,
  deleteTipoProducto
}