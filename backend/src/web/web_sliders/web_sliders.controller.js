import fl from '../../../middleware/filtros.js';
import resp from '../../../middleware/resp.js';
import WebSlider from './web_sliders.model.js';

let getAllWebSliders = async (req, res) => {
  try {
    let where = fl(req.query);
    let web_sliders = await WebSlider.findAll({
      where: where,
    });
    await resp.success({ mensaje: 'WebSliders encontrados', data: web_sliders }, req, res, 'WebSlider');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getOneWebSlider = async (req, res) => {
  try {
    let web_slider = await WebSlider.findOne({ where: { slug: req.params.slug } });
    await resp.success({ mensaje: 'WebSlider encontrado', data: web_slider }, req, res, 'WebSlider');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let createWebSlider = async (req, res) => {
  try {
    let web_slider = await WebSlider.create(req.body);
    await resp.success({ mensaje: 'WebSlider agregado', data: web_slider }, req, res, 'WebSlider');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let updateWebSlider = async (req, res) => {
  try {
    let web_slider = await WebSlider.update(req.body, { where: { slug: req.params.slug } });
    await resp.success({ mensaje: 'WebSlider actualizado', data: web_slider }, req, res, 'WebSlider');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let deleteWebSlider = async (req, res) => {
  try {
    let web_slider = await WebSlider.destroy({ where: { slug: req.params.slug } });
    await resp.success({ mensaje: 'WebSlider eliminado', data: web_slider }, req, res, 'WebSlider');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

export default {
  getAllWebSliders,
  getOneWebSlider,
  createWebSlider,
  updateWebSlider,
  deleteWebSlider
}