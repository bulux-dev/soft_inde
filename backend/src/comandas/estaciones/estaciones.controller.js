import fl from '../../../middleware/filtros.js';
import resp from '../../../middleware/resp.js';
import Estacion from './estaciones.model.js';
import Cuenta from '../cuentas/cuentas.model.js';
import Area from '../areas/areas.model.js';
import Comercio from '../comercios/comercios.model.js';

let getAllEstaciones = async (req, res) => {
  try {
    let where = fl(req.query);
    let estaciones = await Estacion.findAll({
      where: where,
    });
    await resp.success({ mensaje: 'Estaciones encontradas', data: estaciones }, req, res, 'Estacion');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getOneEstacion = async (req, res) => {
  try {
    let estacion = await Estacion.findOne({ 
      where: { id: req.params.id },
      include: [
        {
          model: Cuenta, as: 'cuentas',
          where: { estado: 'ABIERTA' },
          required: false
        },
        {
          model: Area, as: 'area',
          include: [
            {
              model: Comercio, as: 'comercio'
            }
          ]
        }
      ]
    });
    await resp.success({ mensaje: 'Estacion encontrada', data: estacion }, req, res, 'Estacion');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let createEstacion = async (req, res) => {
  try {
    let estacion = await Estacion.create(req.body);
    await resp.success({ mensaje: 'Estacion agregada', data: estacion }, req, res, 'Estacion');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let updateEstacion = async (req, res) => {
  try {
    let estacion = await Estacion.update(req.body, { where: { id: req.params.id } });
    await resp.success({ mensaje: 'Estacion actualizada', data: estacion }, req, res, 'Estacion');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let deleteEstacion = async (req, res) => {
  try {
    let estacion = await Estacion.destroy({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Estacion eliminada', data: estacion }, req, res, 'Estacion');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

export default {
  getAllEstaciones,
  getOneEstacion,
  createEstacion,
  updateEstacion,
  deleteEstacion
}