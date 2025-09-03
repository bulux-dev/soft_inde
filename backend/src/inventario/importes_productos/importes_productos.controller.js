import fl from '../../../middleware/filtros.js';
import resp from '../../../middleware/resp.js';
import ImporteProducto from './importes_productos.model.js';
import Producto from '../productos/productos.model.js';
import Categoria from '../categorias/categorias.model.js';
import Marca from '../marcas/marcas.model.js';

let getAllImportesProductos = async (req, res) => {
  try {
    let where = fl(req.query);
    let importes_productos = await ImporteProducto.findAll({
      where: where,
      include: [
        { model: Categoria, as: 'categoria' },
        { model: Marca, as: 'marca' },
        { model: Producto, as: 'productos', attributes: ['id', 'sku', 'nombre',] }
      ]
    });
    await resp.success({ mensaje: 'ImportesProductos encontrados', data: importes_productos }, req, res, 'Importe Producto');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getOneImporteProducto = async (req, res) => {
  try {
    let importe_producto = await ImporteProducto.findOne({
      where: { id: req.params.id },
    });
    await resp.success({ mensaje: 'ImporteProducto encontrado', data: importe_producto }, req, res, 'Importe Producto');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let createImporteProducto = async (req, res) => {
  try {
    let importe_producto = await ImporteProducto.create(req.body);
    importe_producto.id = importe_producto.null;
    await resp.success({ mensaje: 'ImporteProducto agregado', data: importe_producto }, req, res, 'Importe Producto');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let updateImporteProducto = async (req, res) => {
  try {
    let importe_producto = await ImporteProducto.update(req.body, { where: { id: req.params.id } });
    await resp.success({ mensaje: 'ImporteProducto actualizado', data: importe_producto }, req, res, 'Importe Producto');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let deleteImporteProducto = async (req, res) => {
  try {
    let importe_producto = await ImporteProducto.destroy({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'ImporteProducto eliminado', data: importe_producto }, req, res, 'Importe Producto');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

export default {
  getAllImportesProductos,
  getOneImporteProducto,
  createImporteProducto,
  updateImporteProducto,
  deleteImporteProducto
}