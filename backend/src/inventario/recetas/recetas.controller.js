import fl from '../../../middleware/filtros.js';
import resp from '../../../middleware/resp.js';
import Medida from '../medidas/medidas.model.js';
import Producto from '../productos/productos.model.js';
import TipoProducto from '../tipos_productos/tipos_productos.model.js';
import Receta from './recetas.model.js';

let getAllRecetas = async (req, res) => {
  try {
    let where = fl(req.query);
    let recetas = await Receta.findAll({
      where: where,
      include: [
        {
          model: Producto, as: 'producto_receta',
          include: [
            { 
              model: Medida, as: 'medida' 
            },
            {
              model: TipoProducto, as: 'tipo_producto',
            }
          ]
        }
      ]
    });
    await resp.success({ mensaje: 'Recetas encontradas', data: recetas }, req, res, 'Receta');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getOneReceta = async (req, res) => {
  try {
    let receta = await Receta.findOne({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Receta encontrada', data: receta }, req, res, 'Receta');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let createReceta = async (req, res) => {
  try {
    let receta = await Receta.create(req.body);
    await resp.success({ mensaje: 'Receta agregada', data: receta }, req, res, 'Receta');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let updateReceta = async (req, res) => {
  try {
    let receta = await Receta.update(req.body, { where: { id: req.params.id } });
    await resp.success({ mensaje: 'Receta actualizada', data: receta }, req, res, 'Receta');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let deleteReceta = async (req, res) => {
  try {
    let receta = await Receta.destroy({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Receta eliminada', data: receta }, req, res, 'Receta');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

export default {
  getAllRecetas,
  getOneReceta,
  createReceta,
  updateReceta,
  deleteReceta
}