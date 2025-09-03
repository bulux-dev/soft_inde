import fl from '../../middleware/filtros.js';
import resp from '../../middleware/resp.js';
import moment from 'moment';
import Producto from '../inventario/productos/productos.model.js';
import Categoria from '../inventario/categorias/categorias.model.js';
import ProductoCategoria from '../inventario/productos_categorias/productos_categorias.model.js'
import Marca from '../inventario/marcas/marcas.model.js';;
import ProductoMarca from '../inventario/productos_marcas/productos_marcas.model.js';
import Existencia from '../inventario/existencias/existencias.model.js';
import Medida from '../inventario/medidas/medidas.model.js';
import Web from './web.model.js';
import WebMenu from './web_menus/web_menus.model.js';
import WebSeccion from './web_secciones/web_secciones.model.js';


let getWebs = async (req, res) => {
  try {
    let webs_menus = await WebMenu.findAll({
      include: [
        {
          model: WebSeccion, as: 'web_secciones',
          include: [
            { model: Web, as: 'webs' }
          ]
        }
      ]
    });
    await resp.success({ mensaje: 'Webs encontradas', data: webs_menus }, req, res, 'Web');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getWeb = async (req, res) => {
  try {
    let web = await Web.findOne({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Web encontrada', data: web }, req, res, 'Web');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let createWeb = async (req, res) => {
  try {
    let web = await Web.create(req.body);
    await resp.success({ mensaje: 'Web agregada', data: web }, req, res, 'Web');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let updateWeb = async (req, res) => {
  try {
    let web = await Web.update(req.body, { where: { id: req.params.id } });
    await resp.success({ mensaje: 'Web actualizada', data: web }, req, res, 'Web');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let deleteWeb = async (req, res) => {
  try {
    let web = await Web.destroy({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Web eliminada', data: web }, req, res, 'Web');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getCategorias = async (req, res) => {
  try {
    let categorias = await Categoria.findAll();
    await resp.success({ mensaje: 'Categorias encontradas', data: categorias }, req, res, 'Web');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getMarcas = async (req, res) => {
  try {
    let marcas = await Marca.findAll();
    await resp.success({ mensaje: 'Marcas encontradas', data: marcas }, req, res, 'Web');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getProductosByCategoria = async (req, res) => {
  try {
    let productos = await Producto.findAll({
      include: [
        {
          model: ProductoCategoria, as: 'productos_categorias',
          where: {
            categoria_id: req.params.categoria_id
          }
        },
        {
          model: Existencia, as: 'existencias',
          limit: 1,
          where: {
            mes: moment().format('YYYY-MM')
          }
        },
        {
          model: Medida, as: 'medida'
        }
      ]
    });
    await resp.success({ mensaje: 'Productos encontradas', data: productos }, req, res, 'Web');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getProductosByMarca = async (req, res) => {
  try {
    let productos = await Producto.findAll({
      include: [
        {
          model: ProductoMarca, as: 'productos_marcas',
          where: {
            marca_id: req.params.marca_id
          }
        },
        {
          model: Existencia, as: 'existencias',
          limit: 1,
          where: {
            mes: moment().format('YYYY-MM')
          }
        },
        {
          model: Medida, as: 'medida'
        }
      ]
    });
    await resp.success({ mensaje: 'Productos encontradas', data: productos }, req, res, 'Web');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getOneProducto = async (req, res) => {
  try {
    let where = fl(req.query);
    where.id = req.params.id
    let producto = await Producto.findOne({
      where: where,
      include: [
        {
          model: ProductoCategoria, as: 'productos_categorias',
          include: [
            { model: Categoria, as: 'categoria' }
          ]
        },
        {
          model: ProductoMarca, as: 'productos_marcas',
          include: [
            { model: Marca, as: 'marca' }
          ]
        },
        {
          model: Existencia, as: 'existencias',
          limit: 1,
          where: {
            mes: moment().format('YYYY-MM')
          }
        },
        {
          model: Medida, as: 'medida'
        }
      ]
    });
    await resp.success({ mensaje: 'Producto encontrado', data: producto }, req, res, 'Web');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

export default {
  getWebs,
  getWeb,
  createWeb,
  updateWeb,
  deleteWeb,
  getCategorias,
  getMarcas,
  getProductosByCategoria,
  getProductosByMarca,
  getOneProducto
}