import fl from '../../../middleware/filtros.js';
import resp from '../../../middleware/resp.js';
import Atributo from '../atributos/atributos.model.js';
import ProductoAtributo from './productos_atributos.model.js';
import Termino from '../terminos/terminos.model.js';
import Valor from '../valores/valores.model.js';

let getAllProductosAtributos = async (req, res) => {
  try {
    let where = fl(req.query);
    let productos_atributos = await ProductoAtributo.findAll({
      where: where,
    });
    await resp.success({ mensaje: 'Productos Atributos encontrados', data: productos_atributos }, req, res, 'Producto Atributo');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getOneProductoAtributo = async (req, res) => {
  try {
    let producto_atributo = await ProductoAtributo.findOne({
      where: { id: req.params.id }
    });
    await resp.success({ mensaje: 'Producto Atributo encontrado', data: producto_atributo }, req, res, 'Producto Atributo');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getAllProductoAtributosByProducto = async (req, res) => {
  try {
    let atributos = await ProductoAtributo.findAll({
      where: { producto_id: req.params.producto_id },
      include: [
        {
          model: Atributo, as: 'atributo'
        },
        {
          model: Termino, as: 'terminos',
          include: [
            {
              model: Valor, as: 'valor'
            }
          ]
        }
      ]
    });
    await resp.success({ mensaje: 'Atributos encontrados', data: atributos }, req, res, 'Atributo');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let createProductoAtributo = async (req, res) => {
  try {
    let producto_atributo = await ProductoAtributo.findOne({ where: { producto_id: req.body.producto_id, atributo_id: req.body.atributo_id } });
    if (producto_atributo) {
      return resp.error('Atributo ya asignada', req, res, 'Producto Atributo');
    } else {
      producto_atributo = await ProductoAtributo.create(req.body);
      await resp.success({ mensaje: 'Producto Atributo agregado', data: producto_atributo }, req, res, 'Producto Atributo');
    }
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let updateProductoAtributo = async (req, res) => {
  try {
    let producto_atributo = await ProductoAtributo.update(req.body, { where: { id: req.params.id } });
    await resp.success({ mensaje: 'Producto Atributo actualizado', data: producto_atributo }, req, res, 'Producto Atributo');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let deleteProductoAtributo = async (req, res) => {
  try {
    let producto_atributo = await ProductoAtributo.destroy({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Producto Atributo eliminado', data: producto_atributo }, req, res, 'Producto Atributo');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

export default {
  getAllProductosAtributos,
  getOneProductoAtributo,
  getAllProductoAtributosByProducto,
  createProductoAtributo,
  updateProductoAtributo,
  deleteProductoAtributo
}