import fl from '../../../middleware/filtros.js';
import resp from '../../../middleware/resp.js';
import CategoriaSucursal from './categorias_sucursales.model.js';

let getAllCategoriasSucursales = async (req, res) => {
  try {
    let where = fl(req.query);
    let categorias_sucursales = await CategoriaSucursal.findAll({
      where: where,
    });
    await resp.success({ mensaje: 'Categorias Sucursales encontradas', data: categorias_sucursales }, req, res, 'Producto Categoria');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getOneCategoriaSucursal = async (req, res) => {
  try {
    let categoria_sucursal = await CategoriaSucursal.findOne({
      where: { id: req.params.id }
    });
    await resp.success({ mensaje: 'Categoria Sucursal encontrada', data: categoria_sucursal }, req, res, 'Producto Categoria');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let createCategoriaSucursal = async (req, res) => {
  try {
    let categoria_sucursal = await CategoriaSucursal.findOne({ where: { producto_id: req.body.producto_id, categoria_id: req.body.categoria_id } });
    if (categoria_sucursal) {
      return resp.error('Categoria ya asignada', req, res, 'Producto Categoria');
    } else {
      categoria_sucursal = await CategoriaSucursal.create(req.body);
      await resp.success({ mensaje: 'Categoria Sucursal agregada', data: categoria_sucursal }, req, res, 'Producto Categoria');
    }
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let updateCategoriaSucursal = async (req, res) => {
  try {
    let categoria_sucursal = await CategoriaSucursal.update(req.body, { where: { id: req.params.id } });
    await resp.success({ mensaje: 'Categoria Sucursal actualizada', data: categoria_sucursal }, req, res, 'Producto Categoria');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let deleteCategoriaSucursal = async (req, res) => {
  try {
    let categoria_sucursal = await CategoriaSucursal.destroy({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Categoria Sucursal eliminada', data: categoria_sucursal }, req, res, 'Producto Categoria');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

export default {
  getAllCategoriasSucursales,
  getOneCategoriaSucursal,
  createCategoriaSucursal,
  updateCategoriaSucursal,
  deleteCategoriaSucursal
}