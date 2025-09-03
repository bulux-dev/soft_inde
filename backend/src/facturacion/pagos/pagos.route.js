import express from 'express';
import auth from '../../../middleware/auth.js';
import pagosController from './pagos.controller.js';

let router = express.Router();

router.get('/', auth, pagosController.getAllPagos);
router.get('/:id', auth, pagosController.getOnePago);
router.post('/', auth, pagosController.createPago);
router.put('/:id', auth, pagosController.updatePago);
router.delete('/:id', auth, pagosController.deletePago);

export default router;