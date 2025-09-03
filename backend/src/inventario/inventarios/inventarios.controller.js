import fl from '../../../middleware/filtros.js';
import resp from '../../../middleware/resp.js';
import Existencia from '../existencias/existencias.model.js';
import Inventario from './inventarios.model.js';
import moment from 'moment';

let getAllInventarios = async (req, res) => {
  try {
    let where = fl(req.query);
    let inventarios = await Inventario.findAll({
      where: where,
      order: [
        ['mes', 'DESC']
      ]
    });
    await resp.success({ mensaje: 'Inventarios encontradas', data: inventarios }, req, res, 'Inventario');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getOneInventario = async (req, res) => {
  try {
    let inventario = await Inventario.findOne({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Inventario encontrado', data: inventario }, req, res, 'Inventario');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let createInventario = async (req, res) => {
  try {
    let inventario = await Inventario.create(req.body);
    inventario.id = inventario.null;
    await resp.success({ mensaje: 'Inventario agregado', data: inventario }, req, res, 'Inventario');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let cierreInventario = async (req, res) => {
  try {
    let inventario = await Inventario.findOne({
      where: {
        mes: moment(req.body.mes).format('YYYY-MM'),
        // estado: 'VIGENTE'
      }
    });
    if (inventario) {
      if (inventario.estado == 'CERRADO') {
        await resp.error('Este mes ya se encuentra cerrado', req, res, 'Inventario');
      } else {
        await Inventario.update({ estado: 'CERRADO' }, { where: { id: inventario.id } });
        await Inventario.create({ mes: moment(inventario.mes).add(1, 'month').format('YYYY-MM'), estado: 'VIGENTE' });

        let existencias = await Existencia.findAll({
          where: { mes: moment(inventario.mes).format('YYYY-MM') }
        });
        existencias = JSON.parse(JSON.stringify(existencias));
        for (let e = 0; e < existencias.length; e++) {
          delete existencias[e].id;
          existencias[e].mes = moment(inventario.mes).add(1, 'month').format('YYYY-MM');
          existencias[e].stock_inicial = existencias[e].stock_final;                    
          await Existencia.create(existencias[e]);
        }
        await resp.success({ mensaje: 'Cierre de inventario generado', data: inventario }, req, res, 'Inventario');
      }
    } else {
      await resp.error('No hay inventario para este mes', req, res, 'Inventario');
    }
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let updateInventario = async (req, res) => {
  try {
    Object.keys(req.body).forEach(key => {
      !req.body[key] ? req.body[key] = null : null;
    });
    let inventario = await Inventario.update(req.body, { where: { id: req.params.id } });
    await resp.success({ mensaje: 'Inventario actualizado', data: inventario }, req, res, 'Inventario');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let deleteInventario = async (req, res) => {
  try {
    let inventario = await Inventario.findOne({ where: { id: req.params.id } });
    if (inventario.estado == 'CERRADO') {
      await resp.error('No se puede eliminar el inventario porque ya se encuentra cerrado', req, res, 'Inventario');
      return;
    } else {
      await Inventario.update({ estado: 'VIGENTE' }, { where: { mes: moment(inventario.mes).subtract(1, 'month').format('YYYY-MM') } });
      await Inventario.destroy({ where: { id: req.params.id } }); 

      await Existencia.destroy({ where: { mes: moment(inventario.mes).format('YYYY-MM') } });
      await resp.success({ mensaje: 'Inventario eliminado', data: inventario }, req, res, 'Inventario');
    }
  } catch (err) {
    await resp.error(err, req, res);
  }
}

export default {
  getAllInventarios,
  getOneInventario,
  createInventario,
  cierreInventario,
  updateInventario,
  deleteInventario
}