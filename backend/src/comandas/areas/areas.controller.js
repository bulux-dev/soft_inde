import fl from '../../../middleware/filtros.js';
import resp from '../../../middleware/resp.js';
import Area from './areas.model.js';
import Estacion from '../estaciones/estaciones.model.js';
import Comercio from '../comercios/comercios.model.js';
import Cuenta from '../cuentas/cuentas.model.js';

let getAllAreas = async (req, res) => {
  try {
    let where = fl(req.query);
    let areas = await Area.findAll({
      where: where,
    });
    await resp.success({ mensaje: 'Areas encontradas', data: areas }, req, res, 'Area');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getOneArea = async (req, res) => {
  try {
    let area = await Area.findOne({ 
      where: { id: req.params.id },
      include: [
        {
          model: Estacion, as: 'estaciones',
          include: [
            {
              model: Cuenta, as: 'cuentas',
              attributes: ['id', 'estado'],
              where: { estado: 'ABIERTA' },
              required: false
            }
          ]
        },
        {
          model: Comercio, as: 'comercio'
        }
      ]
    });
    await resp.success({ mensaje: 'Area encontrada', data: area }, req, res, 'Area');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let createArea = async (req, res) => {
  try {
    let area = await Area.create(req.body);
    await resp.success({ mensaje: 'Area agregada', data: area }, req, res, 'Area');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let updateArea = async (req, res) => {
  try {
    let area = await Area.update(req.body, { where: { id: req.params.id } });
    await resp.success({ mensaje: 'Area actualizada', data: area }, req, res, 'Area');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let deleteArea = async (req, res) => {
  try {
    let area = await Area.destroy({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Area eliminada', data: area }, req, res, 'Area');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

export default {
  getAllAreas,
  getOneArea,
  createArea,
  updateArea,
  deleteArea
}