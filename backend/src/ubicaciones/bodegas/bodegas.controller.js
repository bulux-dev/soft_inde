import fl from '../../../middleware/filtros.js';
import resp from '../../../middleware/resp.js';
import sucursales_bodegas from '../sucursales_bodegas/sucursales_bodegas.model.js';
import Sucursal from '../sucursales/sucursales.model.js';
import Bodega from './bodegas.model.js';

let getAllBodegas = async (req, res) => {
  try {
    let where = fl(req.query);
    let bodegas = await Bodega.findAll({
      where: where,
    });
    await resp.success({ mensaje: 'Bodegas encontradas', data: bodegas }, req, res, 'Bodega');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getAllBodegasBySucursal = async (req, res) => {
  try {
    let bodegas = await Bodega.findAll({
      include: [
        {
          model: sucursales_bodegas, as: 'sucursales_bodegas',
          where: { sucursal_id: req.params.sucursal_id },
        }
      ]
    });
    await resp.success({ mensaje: 'Bodegas encontradas', data: bodegas }, req, res, 'Bodega');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getOneBodega = async (req, res) => {
  try {
    let bodega = await Bodega.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: sucursales_bodegas, as: 'sucursales_bodegas',
          include: [
            { model: Sucursal, as: 'sucursal' }
          ]
        }
      ]
    });
    await resp.success({ mensaje: 'Bodega encontrada', data: bodega }, req, res, 'Bodega');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let createBodega = async (req, res) => {
  try {
    let bodega = await Bodega.findOne({ where: { nombre: req.body.nombre } });
    if (bodega) {
      return resp.error('Bodega ya existente', req, res, 'Bodega');
    } else {
      let bodega = await Bodega.create(req.body);
      await resp.success({ mensaje: 'Bodega agregada', data: bodega }, req, res, 'Bodega'); 
    }
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let updateBodega = async (req, res) => {
  try {
    let bodega = await Bodega.update(req.body, { where: { id: req.params.id } });
    await resp.success({ mensaje: 'Bodega actualizada', data: bodega }, req, res, 'Bodega');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let deleteBodega = async (req, res) => {
  try {
    let bodega = await Bodega.destroy({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Bodega eliminada', data: bodega }, req, res, 'Bodega');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

export default {
  getAllBodegas,
  getOneBodega,
  createBodega,
  updateBodega,
  deleteBodega,
  getAllBodegasBySucursal
}