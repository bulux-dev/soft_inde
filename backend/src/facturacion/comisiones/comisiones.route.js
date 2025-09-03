import express from 'express';
import auth from '../../../middleware/auth.js';
import comisionesController from './comisiones.controller.js';

let router = express.Router();

router.get('/', auth, comisionesController.getAllComisiones);
router.get('/range/:fecha_inicio/:fecha_fin', auth, comisionesController.getAllComisionesRange);
router.get('/:id', auth, comisionesController.getOneComision);
router.post('/', auth, comisionesController.createComision);
router.put('/:id', auth, comisionesController.updateComision);
router.delete('/:id', auth, comisionesController.deleteComision);

export default router;