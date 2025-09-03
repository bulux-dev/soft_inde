import express from 'express';
import auth from '../../../middleware/auth.js';
import web_menusController from './web_menus.controller.js';

let router = express.Router();

router.get('/', auth, web_menusController.getAllWebMenus);
router.get('/:slug', auth, web_menusController.getOneWebMenu);
router.post('/', auth, web_menusController.createWebMenu);
router.put('/:slug', auth, web_menusController.updateWebMenu);
router.delete('/:slug', auth, web_menusController.deleteWebMenu);

export default router;