import fl from '../../../middleware/filtros.js';
import resp from '../../../middleware/resp.js';
import Comercio from './comercios.model.js';
import Area from '../areas/areas.model.js';
import Estacion from '../estaciones/estaciones.model.js';
import Cuenta from '../cuentas/cuentas.model.js';

let getAllComercios = async (req, res) => {
  try {
    let where = fl(req.query);
    let comercios = await Comercio.findAll({
      where: where
    });
    await resp.success({ mensaje: 'Comercios encontrados', data: comercios }, req, res, 'Comercio');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getAllComerciosArbol = async (req, res) => {
  try {
    let where = fl(req.query);
    let comercios = await Comercio.findAll({
      where: where,
      include: [
        {
          model: Area, as: 'areas',
          include: [
            {
              model: Estacion, as: 'estaciones',
              include: [
                {
                  model: Cuenta, as: 'cuentas',
                  where: { estado: 'ABIERTA' },
                  required: false
                }
              ]
            }
          ]
        }
      ]
    });
    await resp.success({ mensaje: 'Comercios encontrados', data: comercios }, req, res, 'Comercio');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getOneComercio = async (req, res) => {
  try {
    let comercio = await Comercio.findOne({ 
      where: { id: req.params.id },
      include: [
        {
          model: Area, as: 'areas'
        }
      ]
    });
    await resp.success({ mensaje: 'Comercio encontrado', data: comercio }, req, res, 'Comercio');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let createComercio = async (req, res) => {
  try {
    let comercio = await Comercio.create(req.body);
    await resp.success({ mensaje: 'Comercio agregado', data: comercio }, req, res, 'Comercio');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let updateComercio = async (req, res) => {
  try {
    let comercio = await Comercio.update(req.body, { where: { id: req.params.id } });
    await resp.success({ mensaje: 'Comercio actualizado', data: comercio }, req, res, 'Comercio');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let deleteComercio = async (req, res) => {
  try {
    let comercio = await Comercio.destroy({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Comercio eliminado', data: comercio }, req, res, 'Comercio');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

export default {
  getAllComercios,
  getAllComerciosArbol,
  getOneComercio,
  createComercio,
  updateComercio,
  deleteComercio
}