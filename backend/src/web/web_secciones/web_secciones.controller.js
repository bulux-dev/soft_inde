import fl from '../../../middleware/filtros.js';
import resp from '../../../middleware/resp.js';
import WebSeccion from './web_secciones.model.js';

let getAllWebSecciones = async (req, res) => {
  try {
    let where = fl(req.query);
    let web_secciones = await WebSeccion.findAll({
      where: where,
    });
    await resp.success({ mensaje: 'WebSecciones encontrados', data: web_secciones }, req, res, 'WebSeccion');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getOneWebSeccion = async (req, res) => {
  try {
    let web_seccion = await WebSeccion.findOne({ where: { slug: req.params.slug } });
    await resp.success({ mensaje: 'WebSeccion encontrado', data: web_seccion }, req, res, 'WebSeccion');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let createWebSeccion = async (req, res) => {
  try {
    let web_seccion = await WebSeccion.create(req.body);
    await resp.success({ mensaje: 'WebSeccion agregado', data: web_seccion }, req, res, 'WebSeccion');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let updateWebSeccion = async (req, res) => {
  try {
    let web_seccion = await WebSeccion.update(req.body, { where: { slug: req.params.slug } });
    await resp.success({ mensaje: 'WebSeccion actualizado', data: web_seccion }, req, res, 'WebSeccion');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let deleteWebSeccion = async (req, res) => {
  try {
    let web_seccion = await WebSeccion.destroy({ where: { slug: req.params.slug } });
    await resp.success({ mensaje: 'WebSeccion eliminado', data: web_seccion }, req, res, 'WebSeccion');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

export default {
  getAllWebSecciones,
  getOneWebSeccion,
  createWebSeccion,
  updateWebSeccion,
  deleteWebSeccion
}