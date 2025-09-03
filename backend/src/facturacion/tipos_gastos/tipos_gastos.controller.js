import fl from '../../../middleware/filtros.js';
import resp from '../../../middleware/resp.js';
import TipoGasto from './tipos_gastos.model.js';

let getAllTiposGastos = async (req, res) => {
  try {
    let where = fl(req.query);
    let tipos_gastos = await TipoGasto.findAll({
      where: where,
    });
    await resp.success({ mensaje: 'Tipos Gastos encontrados', data: tipos_gastos }, req, res, 'Tipo Gasto');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getOneTipoGasto = async (req, res) => {
  try {
    let tipo_gasto = await TipoGasto.findOne({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Tipo Gasto encontrado', data: tipo_gasto }, req, res, 'Tip Gasto');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let createTipoGasto = async (req, res) => {
  try {
    req.body.nombre = req.body.nombre.trim();
    let tipo_gasto = await TipoGasto.create(req.body);
    await resp.success({ mensaje: 'Tipo Gasto agregado', data: tipo_gasto }, req, res, 'Tipo Gasto');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let updateTipoGasto = async (req, res) => {
  try {
    req.body.nombre = req.body.nombre.trim();
    let tipo_gasto = await TipoGasto.update(req.body, { where: { id: req.params.id } });
    await resp.success({ mensaje: 'Tipo Gasto actualizado', data: tipo_gasto }, req, res, 'Tipo Gasto');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let deleteTipoGasto = async (req, res) => {
  try {
    let tipo_gasto = await TipoGasto.destroy({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Tipo Gasto eliminado', data: tipo_gasto }, req, res, 'Tipo Gasto');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

export default {
  getAllTiposGastos,
  getOneTipoGasto,
  createTipoGasto,
  updateTipoGasto,
  deleteTipoGasto
}