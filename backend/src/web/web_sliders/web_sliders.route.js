import express from 'express';
import auth from '../../../middleware/auth.js';
import web_slidersController from './web_sliders.controller.js';

let router = express.Router();

router.get('/', auth, web_slidersController.getAllWebSliders);
router.get('/:slug', auth, web_slidersController.getOneWebSlider);
router.post('/', auth, web_slidersController.createWebSlider);
router.put('/:slug', auth, web_slidersController.updateWebSlider);
router.delete('/:slug', auth, web_slidersController.deleteWebSlider);

export default router;