import fl from '../../../middleware/filtros.js';
import resp from '../../../middleware/resp.js';
import Empleado from './empleados.model.js';

let getAllEmpleados = async (req, res) => {
  try {
    let where = fl(req.query);
    let empleados = await Empleado.findAll({
      where: where,
    });
    await resp.success({ mensaje: 'Empleados encontrados', data: empleados }, req, res, 'Empleado');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getOneEmpleado = async (req, res) => {
  try {
    let empleado = await Empleado.findOne({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Empleado encontrado', data: empleado }, req, res, 'Empleado');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let createEmpleado = async (req, res) => {
  try {
    let empleado = await Empleado.create(req.body);
    await resp.success({ mensaje: 'Empleado agregado', data: empleado }, req, res, 'Empleado');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let updateEmpleado = async (req, res) => {
  try {
    let empleado = await Empleado.update(req.body, { where: { id: req.params.id } });
    await resp.success({ mensaje: 'Empleado actualizado', data: empleado }, req, res, 'Empleado');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let deleteEmpleado = async (req, res) => {
  try {
    let empleado = await Empleado.destroy({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Empleado eliminado', data: empleado }, req, res, 'Empleado');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

export default {
  getAllEmpleados,
  getOneEmpleado,
  createEmpleado,
  updateEmpleado,
  deleteEmpleado
}