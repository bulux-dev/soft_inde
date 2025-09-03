import { Op } from 'sequelize';
import fl from '../../../middleware/filtros.js';
import resp from '../../../middleware/resp.js';
import CentroCosto from './centros_costos.model.js';

let getAllCentroCostos = async (req, res) => {
  try {
    let where = fl(req.query);
    where.centro_costo_id = {
      [Op.eq]: null
    };
    let centro_costos = await CentroCosto.findAll({
      where: where,
      include: [
        {
          model: CentroCosto, as: 'centros_costos_hijas',
          include: [
            {
              model: CentroCosto, as: 'centros_costos_hijas',
              include:
              {
                model: CentroCosto, as: 'centros_costos_hijas',
                include: [
                  {
                    model: CentroCosto, as: 'centros_costos_hijas',
                  },
                ],
              },
            },
          ],
        },
      ],
    });
    await resp.success({ mensaje: 'Centros costos encontrados', data: centro_costos }, req, res, 'Centro Costo');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getCentrosJornalizacion = async (req, res) => {
  try {
    let centro_costos = await CentroCosto.findAll({ 
      where: { 
        tipo: 'JORNALIZACION' } });
    await resp.success({ mensaje: 'Centros jornalizacion encontrados', data: centro_costos }, req, res, 'Centro Costo');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getOneCentroCosto = async (req, res) => {
  try {
    let centro_costos = await CentroCosto.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: CentroCosto, as: 'centro_costo_padre',
        },
        {
          model: CentroCosto, as: 'centros_costos_hijas',
        }
      ]
    });
    await resp.success({ mensaje: 'Centro Costo Encontrado', data: centro_costos }, req, res, 'Centro Costo');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let createCentroCosto = async (req, res) => {
  try {
    let centro_costos = await CentroCosto.findOne({ where: { numero: req.body.numero } });
    if (centro_costos) {
      return resp.error('Centro Costo ya existente', req, res);
    }
    centro_costos = await CentroCosto.create(req.body);
    await resp.success({ mensaje: 'Centro Costo agregado', data: centro_costos }, req, res, 'Centro Costo');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let updateCentroCosto = async (req, res) => {
  try {
    let centro_costos = await CentroCosto.update(req.body, { where: { id: req.params.id } });
    await resp.success({ mensaje: 'Centro Costo actualizado', data: centro_costos }, req, res, 'Centro Costo');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let deleteCentroCosto = async (req, res) => {
  try {
    let centro_costos = await CentroCosto.destroy({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Centro Costo eliminado', data: centro_costos }, req, res, 'Centro Costo');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

export default {
  getAllCentroCostos,
  getOneCentroCosto,
  createCentroCosto,
  updateCentroCosto,
  deleteCentroCosto,
  getCentrosJornalizacion,
};