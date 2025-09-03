import fl from '../../../middleware/filtros.js';
import resp from '../../../middleware/resp.js';
import Marca from './marcas.model.js';
import ProductoMarca from '../productos_marcas/productos_marcas.model.js';

let getAllMarcas = async (req, res) => {
  try {
    let where = fl(req.query);
    let marcas = await Marca.findAll({
      where: where,
      include: [
        {
          model: ProductoMarca, as: 'productos_marcas',
          attributes: ['id'],
        }
      ]
    });
    await resp.success({ mensaje: 'Marcas encontradas', data: marcas }, req, res, 'Marca');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getOneMarca = async (req, res) => {
  try {
    let marca = await Marca.findOne({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Marca encontrada', data: marca }, req, res, 'Marca');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let createMarca = async (req, res) => {
  try {
    req.body.nombre = req.body.nombre.trim();
    let marca = await Marca.create(req.body);
    await resp.success({ mensaje: 'Marca agregada', data: marca }, req, res, 'Marca');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let updateMarca = async (req, res) => {
  try {
    req.body.nombre = req.body.nombre.trim();
    let marca = await Marca.update(req.body, { where: { id: req.params.id } });
    await resp.success({ mensaje: 'Marca actualizada', data: marca }, req, res, 'Marca');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let deleteMarca = async (req, res) => {
  try {
    let marca = await Marca.destroy({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Marca eliminada', data: marca }, req, res, 'Marca');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

export default {
  getAllMarcas,
  getOneMarca,
  createMarca,
  updateMarca,
  deleteMarca
}