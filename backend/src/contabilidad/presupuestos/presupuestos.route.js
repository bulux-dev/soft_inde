import express from 'express';
import auth from '../../../middleware/auth.js';
import presupuestoController from './presupuestos.controller.js';

let router = express.Router();

router.get('/', auth, presupuestoController.getAllPresupuestos);
router.get('/:id', auth, presupuestoController.getOnePresupuesto);
router.post('/', auth, presupuestoController.createPresupuesto);
router.put('/:id', auth, presupuestoController.updatePresupuesto);
router.delete('/:id', auth, presupuestoController.deletePresupuesto);

export default router;