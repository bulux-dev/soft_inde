import express from 'express';
import auth from '../../../middleware/auth.js';
import variacionesController from './variaciones.controller.js';

let router = express.Router();

router.get('/', auth, variacionesController.getAllVariaciones);
router.get('/:id', auth, variacionesController.getOneVariacion);
router.post('/', auth, variacionesController.createVariacion);
router.put('/:id', auth, variacionesController.updateVariacion);
router.delete('/:id', auth, variacionesController.deleteVariacion);

router.post('/combinaciones', auth, variacionesController.createVariacionCombinaciones);

export default router;