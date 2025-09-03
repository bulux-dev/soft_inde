import fl from '../../../middleware/filtros.js';
import resp from '../../../middleware/resp.js';
import Existencia from '../existencias/existencias.model.js';
import Medida from '../medidas/medidas.model.js';
import Producto from '../productos/productos.model.js';
import Lote from './lotes.model.js';
import moment from 'moment';

let getAllLotes = async (req, res) => {
  try {
    let where = fl(req.query, 'eq');
    let lotes = await Lote.findAll({
      where: where,
      include: [
        {
          model: Producto, as: 'producto',
          include: [
            {
              model: Medida, as: 'medida'
            }
          ]
        },
        {
          model: Existencia, as: 'existencias',
          where: {
            mes: moment().format('YYYY-MM'),
          },
          limit: 1,
          order: [
            ['id', 'DESC']
          ]
        }
      ]
    });
  
    await resp.success({ mensaje: 'Lotes encontrados', data: lotes }, req, res, 'Lote');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getAllLotesExistentes = async (req, res) => {
  try {
    let where = fl(req.query, 'eq');    
    let lotes = await Lote.findAll({
      where: where,
      include: [
        {
          model: Existencia, as: 'existencias',
          where: {
            mes: moment().format('YYYY-MM'),
          },
          order: [
            ['id', 'DESC']
          ]
        }
      ]
    });
    
    lotes = JSON.parse(JSON.stringify(lotes));
    let lotes_existentes = [];
    for (let l = 0; l < lotes.length; l++) {    
      if (lotes[l].existencias.length ? lotes[l].existencias[0].stock_final > 0 : false) {
        lotes_existentes.push(lotes[l]);   
      }
    }
    await resp.success({ mensaje: 'Lotes encontrados', data: lotes_existentes }, req, res, 'Lote');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getOneLote = async (req, res) => {
  try {
    let lote = await Lote.findOne({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Lote encontrado', data: lote }, req, res, 'Lote');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let createLote = async (req, res) => {
  try {
    let lote = await Lote.create(req.body);
    await resp.success({ mensaje: 'Lote agregado', data: lote }, req, res, 'Lote');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let updateLote = async (req, res) => {
  try {
    let lote = await Lote.update(req.body, { where: { id: req.params.id } });
    await resp.success({ mensaje: 'Lote actualizado', data: lote }, req, res, 'Lote');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let deleteLote = async (req, res) => {
  try {
    let lote = await Lote.destroy({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Lote eliminado', data: lote }, req, res, 'Lote');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

export default {
  getAllLotes,
  getAllLotesExistentes,
  getOneLote,
  createLote,
  updateLote,
  deleteLote
}