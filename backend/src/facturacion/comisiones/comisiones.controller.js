import { Op } from 'sequelize';
import fl from '../../../middleware/filtros.js';
import resp from '../../../middleware/resp.js';
import Empleado from '../../personal/empleados/empleados.model.js';
import Comision from './comisiones.model.js';
import Venta from '../ventas/ventas.model.js';
import Documento from '../documentos/documentos.model.js';

let getAllComisiones = async (req, res) => {
  try {
    let where = fl(req.query);
    let comisiones = await Comision.findAll({
      where: where,
      order: [
        ['fecha', 'DESC'],
        ['id', 'DESC']
      ]
    });
    await resp.success({ mensaje: 'Comisiones encontradas', data: comisiones }, req, res, 'Comision');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getAllComisionesRange = async (req, res) => {
  try {
    let where = fl(req.query, 'eq');
    where.fecha = {
      [Op.between]: [req.params.fecha_inicio, req.params.fecha_fin]
    }
    let comisiones = await Comision.findAll({
      where: where,
      include: [
        {
          model: Empleado, as: 'empleado',
          attributes: ['id', 'nombre', 'apellido']
        },
        {
          model: Venta, as: 'venta',
          include: [
            {
              model: Documento, as: 'documento',
            }
          ]
        }
      ],
      order: [
        ['fecha', 'DESC'],
        ['id', 'DESC']
      ]
    });
    await resp.success({ mensaje: 'Comisiones encontradas', data: comisiones }, req, res, 'Comision');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getOneComision = async (req, res) => {
  try {
    let comision = await Comision.findOne({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Comision encontrada', data: comision }, req, res, 'Comision');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let createComision = async (req, res) => {
  try {
    let comision = await Comision.create(req.body);
    await resp.success({ mensaje: 'Comision agregada', data: comision }, req, res, 'Comision');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let updateComision = async (req, res) => {
  try {
    let comision = await Comision.update(req.body, { where: { id: req.params.id } });
    await resp.success({ mensaje: 'Comision actualizada', data: comision }, req, res, 'Comision');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let deleteComision = async (req, res) => {
  try {
    let comision = await Comision.destroy({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Comision eliminada', data: comision }, req, res, 'Comision');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

export default {
  getAllComisiones,
  getAllComisionesRange,
  getOneComision,
  createComision,
  updateComision,
  deleteComision
}