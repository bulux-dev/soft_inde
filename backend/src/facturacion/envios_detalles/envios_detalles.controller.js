import fl from '../../../middleware/filtros.js';
import resp from '../../../middleware/resp.js';
import envioDetalle from './envios_detalles.model.js';

let getAllEnviosDetalles = async (req, res) => {
  try {
    let where = fl(req.query);
    let envios_detalles = await envioDetalle.findAll({
      where: where,
    });
    await resp.success({ mensaje: 'Detalles de Envios encontrados', data: envios_detalles }, req, res, 'Envio Detalle');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getOneEnvioDetalle = async (req, res) => {
  try {
    let envio_detalle = await envioDetalle.findOne({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Detalle de Envio encontrado', data: envio_detalle }, req, res, 'Envio Detalle');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let createEnvioDetalle = async (req, res) => {
  try {
    let envio_detalle = await envioDetalle.create(req.body);
    await resp.success({ mensaje: 'Detalle de Envio agregado', data: envio_detalle }, req, res, 'Envio Detalle');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let updateEnvioDetalle = async (req, res) => {
  try {
    let envio_detalle = await envioDetalle.update(req.body, { where: { id: req.params.id } });
    await resp.success({ mensaje: 'Detalle de Envio actualizado', data: envio_detalle }, req, res, 'Envio Detalle');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let deleteEnvioDetalle = async (req, res) => {
  try {
    let envio_detalle = await envioDetalle.destroy({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Detalle de Envio eliminado', data: envio_detalle }, req, res, 'Envio Detalle');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

export default {
  getAllEnviosDetalles,
  getOneEnvioDetalle,
  createEnvioDetalle,
  updateEnvioDetalle,
  deleteEnvioDetalle
}