import express from 'express';
import auth from '../../../middleware/auth.js';
import variacionesDetallesController from './variaciones_detalles.controller.js';

let router = express.Router();

router.get('/', auth, variacionesDetallesController.getAllVariacionesDetalles);
router.get('/:id', auth, variacionesDetallesController.getOneVariacionDetalle);
router.post('/', auth, variacionesDetallesController.createVariacionDetalle);
router.put('/:id', auth, variacionesDetallesController.updateVariacionDetalle);
router.delete('/:id', auth, variacionesDetallesController.deleteVariacionDetalle);

export default router;