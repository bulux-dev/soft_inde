import express from 'express';
import auth from '../../../middleware/auth.js';
import web_seccionesController from './web_secciones.controller.js';

let router = express.Router();

router.get('/', auth, web_seccionesController.getAllWebSecciones);
router.get('/:slug', auth, web_seccionesController.getOneWebSeccion);
router.post('/', auth, web_seccionesController.createWebSeccion);
router.put('/:slug', auth, web_seccionesController.updateWebSeccion);
router.delete('/:slug', auth, web_seccionesController.deleteWebSeccion);

export default router;