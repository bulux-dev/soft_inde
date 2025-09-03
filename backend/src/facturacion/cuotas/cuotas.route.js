import express from 'express';
import auth from '../../../middleware/auth.js';
import cuotasController from './cuotas.controller.js';

let router = express.Router();

router.get('/', auth, cuotasController.getAllCuotas);
router.get('/:id', auth, cuotasController.getOneCuota);
router.post('/', auth, cuotasController.createCuota);
router.put('/:id', auth, cuotasController.updateCuota);
router.delete('/:id', auth, cuotasController.deleteCuota);

export default router;