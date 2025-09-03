import fl from '../../../middleware/filtros.js';
import resp from '../../../middleware/resp.js';
import SucursalBodega from '../sucursales_bodegas/sucursales_bodegas.model.js';
import Bodega from '../bodegas/bodegas.model.js';
import Sucursal from './sucursales.model.js';

let getAllSucursales = async (req, res) => {
  try {
    let where = fl(req.query);
    let sucursales = await Sucursal.findAll({
      where: where,
    });
    await resp.success({ mensaje: 'Sucursales encontradas', data: sucursales }, req, res, 'Sucursal');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getOneSucursal = async (req, res) => {
  try {
    let sucursal = await Sucursal.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: SucursalBodega, as: 'sucursales_bodegas',
          include: [
            { model: Bodega, as: 'bodega' }
          ]
        }
      ]
    });
    await resp.success({ mensaje: 'Sucursal encontrada', data: sucursal }, req, res, 'Sucursal');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let createSucursal = async (req, res) => {
  try {
    let sucursal = await Sucursal.findOne({ where: { nombre: req.body.nombre } });
    if (sucursal) {
      return resp.error('Sucursal ya existente', req, res, 'Sucursal');
    } else {
      let sucursal = await Sucursal.create(req.body);

      let sucursales_bodegas = JSON.parse(JSON.stringify(req.body.sucursales_bodegas));

      for (let p = 0; p < sucursales_bodegas.length; p++) {
        await SucursalBodega.create({
          bodega_id: sucursales_bodegas[p].id,
          sucursal_id: sucursal.id
        });
      }

      await resp.success({ mensaje: 'Sucursal agregada', data: sucursal }, req, res, 'Sucursal');
    }
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let updateSucursal = async (req, res) => {
  try {
    let sucursal = await Sucursal.update(req.body, { where: { id: req.params.id } });

    // Obtener informacion
    let bodegas = JSON.parse(JSON.stringify(await SucursalBodega.findAll({ where: { sucursal_id: req.params.id } })))
    let sucursales_bodegas = JSON.parse(JSON.stringify(req.body.sucursales_bodegas));

    // Segmentar informacion
    for (let sb = 0; sb < sucursales_bodegas.length; sb++) {
      for (let b = 0; b < bodegas.length; b++) {
        if (bodegas[b].bodega_id == sucursales_bodegas[sb].id) {
          bodegas.splice(b, 1);
          sucursales_bodegas.splice(sb, 1);
          b++;
        }
      }
    }

    // Eliminar
    for (let c = 0; c < bodegas.length; c++) {
      await SucursalBodega.destroy({ where: { id: bodegas[c].id } });
    }

    // Crear
    for (let p = 0; p < sucursales_bodegas.length; p++) {
      await SucursalBodega.upsert({
        bodega_id: sucursales_bodegas[p].id,
        sucursal_id: req.params.id
      });
    }

    await resp.success({ mensaje: 'Sucursal actualizada', data: sucursal }, req, res, 'Sucursal');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let deleteSucursal = async (req, res) => {
  try {
    let sucursal = await Sucursal.destroy({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Sucursal eliminada', data: sucursal }, req, res, 'Sucursal');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

export default {
  getAllSucursales,
  getOneSucursal,
  createSucursal,
  updateSucursal,
  deleteSucursal
}