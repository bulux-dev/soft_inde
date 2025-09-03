import fl from '../../../middleware/filtros.js';
import resp from '../../../middleware/resp.js';
import SucursalBodega from './sucursales_bodegas.model.js';

let getAllSucursalesBodegas = async (req, res) => {
  try {
    let where = fl(req.query);
    let sucursales_bodegas = await SucursalBodega.findAll({
      where: where,
    });
    await resp.success({ mensaje: 'Sucursales Bodegas encontradas', data: sucursales_bodegas }, req, res, 'Sucursal Bodega');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getOneSucursalBodega = async (req, res) => {
  try {
    let sucursal_bodega = await SucursalBodega.findOne({
      where: { id: req.params.id }
    });
    await resp.success({ mensaje: 'Sucursal Bodega encontrada', data: sucursal_bodega }, req, res, 'Sucursal Bodega');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let createSucursalBodega = async (req, res) => {
  try {
    let sucursal_bodega = await SucursalBodega.findOne({ where: { producto_id: req.body.producto_id, categoria_id: req.body.categoria_id } });
    if (sucursal_bodega) {
      return resp.error('Sucursal ya asignada', req, res, 'Sucursal Bodega');
    } else {
      sucursal_bodega = await SucursalBodega.create(req.body);
      await resp.success({ mensaje: 'Sucursal Bodega agregada', data: sucursal_bodega }, req, res, 'Sucursal Bodega');
    }
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let updateSucursalBodega = async (req, res) => {
  try {
    let sucursal_bodega = await SucursalBodega.update(req.body, { where: { id: req.params.id } });
    await resp.success({ mensaje: 'Sucursal Bodega actualizada', data: sucursal_bodega }, req, res, 'Sucursal Bodega');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let deleteSucursalBodega = async (req, res) => {
  try {
    let sucursal_bodega = await SucursalBodega.destroy({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Sucursal Bodega eliminada', data: sucursal_bodega }, req, res, 'Sucursal Bodega');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

export default {
  getAllSucursalesBodegas,
  getOneSucursalBodega,
  createSucursalBodega,
  updateSucursalBodega,
  deleteSucursalBodega
}