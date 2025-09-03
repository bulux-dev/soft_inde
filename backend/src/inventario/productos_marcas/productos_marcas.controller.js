import fl from '../../../middleware/filtros.js';
import resp from '../../../middleware/resp.js';
import ProductoMarca from './productos_marcas.model.js';

let getAllProductosMarcas = async (req, res) => {
  try {
    let where = fl(req.query);
    let productos_marcas = await ProductoMarca.findAll({
      where: where,
    });
    await resp.success({ mensaje: 'Productos Marcas encontrados', data: productos_marcas }, req, res, 'Producto Marca');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getOneProductoMarca = async (req, res) => {
  try {
    let producto_marca = await ProductoMarca.findOne({
      where: { id: req.params.id }
    });
    await resp.success({ mensaje: 'Producto Marca encontrado', data: producto_marca }, req, res, 'Producto Marca');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let createProductoMarca = async (req, res) => {
  try {
    let producto_marca = await ProductoMarca.findOne({ where: { producto_id: req.body.producto_id, marca_id: req.body.marca_id } });
    if (producto_marca) {
      return resp.error('Marca ya asignada', req, res, 'Producto Marca');
    } else {
      producto_marca = await ProductoMarca.create(req.body);
      await resp.success({ mensaje: 'Producto Marca agregada', data: producto_marca }, req, res, 'Producto Marca');
    }
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let updateProductoMarca = async (req, res) => {
  try {
    let producto_marca = await ProductoMarca.update(req.body, { where: { id: req.params.id } });
    await resp.success({ mensaje: 'Producto Medida actualizada', data: producto_marca }, req, res, 'Producto Marca');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let deleteProductoMarca = async (req, res) => {
  try {
    let producto_marca = await ProductoMarca.destroy({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Producto Marca eliminada', data: producto_marca }, req, res, 'Producto Marca');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

export default {
  getAllProductosMarcas,
  getOneProductoMarca,
  createProductoMarca,
  updateProductoMarca,
  deleteProductoMarca
}