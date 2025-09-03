import { Op } from 'sequelize';
import fl from '../../../middleware/filtros.js';
import resp from '../../../middleware/resp.js';
import Sucursal from '../../ubicaciones/sucursales/sucursales.model.js';
import CategoriaSucursal from '../categorias_sucursales/categorias_sucursales.model.js';
import Producto from '../productos/productos.model.js';
import ProductoCategoria from '../productos_categorias/productos_categorias.model.js';
import Categoria from './categorias.model.js';
import Impresora from '../../soporte/impresoras/impresoras.model.js';

let getAllCategorias = async (req, res) => {
  try {
    let padres = req.query.padres;
    delete req.query.padres;
    let where = fl(req.query);    
    if (padres == 'true') {
      where.categoria_id = { [Op.eq]: null };
    }
    let categorias = await Categoria.findAll({
      where: where,
      include: [
        {
          model: Categoria, as: 'subcategorias',
          include: [
            {
              model: Categoria, as: 'subcategorias',
            },
          ]
        },
        {
          model: ProductoCategoria, as: 'productos_categorias',
          attributes: ['id'],
        },
      ],
      order: [
        ['nombre', 'ASC']
      ]
    });
    await resp.success({ mensaje: 'Categorias encontradas', data: categorias }, req, res, 'Categoria');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getAllCategoriasBySucursal = async (req, res) => {
  try {
    let where = fl(req.query);
    where.categoria_id = { [Op.eq]: null };
    let categorias = await Categoria.findAll({
      where: where,
      include: [
        {
          model: Categoria, as: 'subcategorias',
          include: [
            {
              model: ProductoCategoria, as: 'productos_categorias',
              attributes: ['id'],
            },
            {
              model: Categoria, as: 'subcategorias',
              include: [
                {
                  model: ProductoCategoria, as: 'productos_categorias',
                  attributes: ['id'],
                }
              ]
            }
          ]
        },
        {
          model: ProductoCategoria, as: 'productos_categorias',
          attributes: ['id'],
        },
        {
          model: CategoriaSucursal, as: 'categorias_sucursales',
          where: { sucursal_id: req.params.sucursal_id },
        }
      ],
      order: [
        ['nombre', 'ASC']
      ]
    });
    await resp.success({ mensaje: 'Categorias encontradas', data: categorias }, req, res, 'Categoria');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getOneCategoria = async (req, res) => {
  try {
    let categoria = await Categoria.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: ProductoCategoria, as: 'productos_categorias',
          include: [
            {
              model: Producto, as: 'producto',
            }
          ]
        },
        {
          model: CategoriaSucursal, as: 'categorias_sucursales',
          include: [
            {
              model: Sucursal, as: 'sucursal',
            }
          ]
        },
        {
          model: Categoria, as: 'categoria_padre',
        },
        {
          model: Impresora, as: 'impresora',
        }
      ]
    });
    await resp.success({ mensaje: 'Categoria encontrada', data: categoria }, req, res, 'Categoria');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let createCategoria = async (req, res) => {
  try {
    req.body.nombre = req.body.nombre.trim();
    let categoria = await Categoria.create(req.body);
    categoria.id = categoria.null;

    let categorias_sucursales = JSON.parse(JSON.stringify(req.body.categorias_sucursales));

    for (let c = 0; c < categorias_sucursales.length; c++) {
      await CategoriaSucursal.create({
        sucursal_id: categorias_sucursales[c].id,
        categoria_id: categoria.id
      });
    }

    await resp.success({ mensaje: 'Categoria agregada', data: categoria }, req, res, 'Categoria');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let updateCategoria = async (req, res) => {
  try {
    req.body.nombre = req.body.nombre.trim();
    let categoria = await Categoria.update(req.body, { where: { id: req.params.id } });
    if (categoria) {
      let sucursales = JSON.parse(JSON.stringify(await CategoriaSucursal.findAll({ where: { categoria_id: req.params.id } })))
      let categorias_sucursales = JSON.parse(JSON.stringify(req.body.categorias_sucursales));

      for (let pc = 0; pc < categorias_sucursales.length; pc++) {
        for (let c = 0; c < sucursales.length; c++) {
          if (sucursales[c].sucursal_id == categorias_sucursales[pc].id) {
            sucursales.splice(c, 1);
            categorias_sucursales.splice(pc, 1);
            c++;
          }
        }
      }

      for (let c = 0; c < sucursales.length; c++) {
        await CategoriaSucursal.destroy({ where: { id: sucursales[c].id } });
      }

      for (let p = 0; p < categorias_sucursales.length; p++) {
        await CategoriaSucursal.upsert({
          sucursal_id: categorias_sucursales[p].id,
          categoria_id: req.params.id
        });
      }
    }

    await resp.success({ mensaje: 'Categoria actualizada', data: categoria }, req, res, 'Categoria');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let deleteCategoria = async (req, res) => {
  try {
    let categoria = await Categoria.destroy({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Categoria eliminada', data: categoria }, req, res, 'Categoria');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

export default {
  getAllCategorias,
  getAllCategoriasBySucursal,
  getOneCategoria,
  createCategoria,
  updateCategoria,
  deleteCategoria
}