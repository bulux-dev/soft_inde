import fl from '../../../middleware/filtros.js';
import resp from '../../../middleware/resp.js';
import Web from '../web.model.js';
import WebSeccion from '../web_secciones/web_secciones.model.js';
import WebMenu from './web_menus.model.js';

let getAllWebMenus = async (req, res) => {
  try {
    let where = fl(req.query);
    let web_menus = await WebMenu.findAll({
      where: where,
      include: [
        {
          model: WebSeccion, as: 'web_secciones',
          include: [
            { model: Web, as: 'webs' }
          ]
        }
      ],
      order: [
        ['orden', 'ASC'],
        [{ model: WebSeccion, as: 'web_secciones' }, 'orden', 'ASC'],
        [{ model: WebSeccion, as: 'web_secciones' }, { model: Web, as: 'webs' }, 'orden', 'ASC']
      ]
    });
    await resp.success({ mensaje: 'WebMenus encontrados', data: web_menus }, req, res, 'WebMenu');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getOneWebMenu = async (req, res) => {
  try {
    let web_menu = await WebMenu.findOne({ where: { slug: req.params.slug } });
    await resp.success({ mensaje: 'WebMenu encontrado', data: web_menu }, req, res, 'WebMenu');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let createWebMenu = async (req, res) => {
  try {
    let web_menu = await WebMenu.create(req.body);
    await resp.success({ mensaje: 'WebMenu agregado', data: web_menu }, req, res, 'WebMenu');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let updateWebMenu = async (req, res) => {
  try {
    let web_menu = await WebMenu.update(req.body, { where: { slug: req.params.slug } });
    await resp.success({ mensaje: 'WebMenu actualizado', data: web_menu }, req, res, 'WebMenu');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let deleteWebMenu = async (req, res) => {
  try {
    let web_menu = await WebMenu.destroy({ where: { slug: req.params.slug } });
    await resp.success({ mensaje: 'WebMenu eliminado', data: web_menu }, req, res, 'WebMenu');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

export default {
  getAllWebMenus,
  getOneWebMenu,
  createWebMenu,
  updateWebMenu,
  deleteWebMenu
}