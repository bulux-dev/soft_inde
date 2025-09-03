import { Op } from 'sequelize';
import fl from '../../../middleware/filtros.js';
import resp from '../../../middleware/resp.js';
import Rubro from './rubros.model.js'

let getAllRubros = async (req, res) => {
  try {
    let where = fl(req.query);
    where.rubro_id = {
      [Op.eq]: null
    };
    let rubros = await Rubro.findAll({
      where: where,
      include: [
        {
          model: Rubro, as: 'rubros_hijos',
          include: [
            {
              model: Rubro, as: 'rubros_hijos',
              include: [
                {
                  model: Rubro, as: 'rubros_hijos',
                  include: [
                    {
                      model: Rubro, as: 'rubros_hijos',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });
    await resp.success({ mensaje: 'Rubros encontrados', data: rubros }, req, res, 'Rubros');
  } catch (err) {
    await resp.error(err, req, res);
  }
}


let getRubrosJornalizacion = async (req, res) => {
  try {
    let rubros = await Rubro.findAll({
      where: {
        tipo: 'JORNALIZACION'
      }
    });
  }catch(err){await resp.error(err, req, res);}
}

let getOneRubro = async (req, res) => {
  try {
    let rubro = await Rubro.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: Rubro, as: 'rubro_padre',
        }, {
          model: Rubro, as: 'rubros_hijos'
        }
      ]
    });
    await resp.success({ mensaje: 'Rubro encontrado', data: rubro }, req, res, 'Rubro');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let createRubro = async (req, res) => {
  try {
    let rubro = await Rubro.findOne({ where: { numero: req.body.numero } });
    if (rubro) {
      return resp.error('Rubro ya existente', req, res);
    }
    rubro = await Rubro.create(req.body);
    await resp.success({ mensaje: 'Rubro agregado', data: rubro }, req, res, 'Rubro');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let updateRubro = async (req, res) => {
  try {
    let rubro = await Rubro.update(req.body, { where: { id: req.params.id } });
    await resp.success({ mensaje: 'Rubro actualizado', data: rubro }, req, res, 'Rubro');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let deleteRubro = async (req, res) => {
  try {
    let rubro = await Rubro.destroy({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Rubro eliminado', data: rubro }, req, res, 'Rubro');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

export default {
  getRubrosJornalizacion,
  getAllRubros,
  getOneRubro,
  createRubro,
  updateRubro,
  deleteRubro,
}