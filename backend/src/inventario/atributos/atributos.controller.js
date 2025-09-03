import fl from '../../../middleware/filtros.js';
import resp from '../../../middleware/resp.js';
import Atributo from './atributos.model.js';
import Valor from '../valores/valores.model.js'
import Termino from '../terminos/terminos.model.js';

let getAllAtributos = async (req, res) => {
  try {
    let where = fl(req.query);
    let atributos = await Atributo.findAll({
      where: where,
      include: [
        {
          model: Valor, as: 'valores'
        }
      ]
    });
    await resp.success({ mensaje: 'Atributos encontrados', data: atributos }, req, res, 'Atributo');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getOneAtributo = async (req, res) => {
  try {
    let atributo = await Atributo.findOne({
      where: { id: req.params.id },
      include: [
        { model: Valor, as: 'valores' }
      ]
    });
    await resp.success({ mensaje: 'Atributo encontrado', data: atributo }, req, res, 'Atributo');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let createAtributo = async (req, res) => {
  try {
    let atributo = await Atributo.findOne({ where: { nombre: req.body.nombre } });
    if (atributo) {
      return resp.error('Atributo ya existente', req, res, 'Atributo');
    } else {
      let atributo = await Atributo.create(req.body);
      await resp.success({ mensaje: 'Atributo agregado', data: atributo }, req, res, 'Atributo');
    }
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let updateAtributo = async (req, res) => {
  try {
    let atributo = await Atributo.update(req.body, { where: { id: req.params.id } });
    await resp.success({ mensaje: 'Atributo actualizado', data: atributo }, req, res, 'Atributo');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let deleteAtributo = async (req, res) => {
  try {
    let atributo = await Atributo.destroy({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Atributo eliminado', data: atributo }, req, res, 'Atributo');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

export default {
  getAllAtributos,
  getOneAtributo,
  createAtributo,
  updateAtributo,
  deleteAtributo
}