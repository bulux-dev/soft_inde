import express from 'express';
import auth from '../../../middleware/auth.js';
import creditosDetallesController from './creditos_detalles.controller.js';

let router = express.Router();

router.get('/', auth, creditosDetallesController.getAllCreditosDetalles);
router.get('/:id', auth, creditosDetallesController.getOneCreditoDetalle);
router.post('/', auth, creditosDetallesController.createCreditoDetalle);
router.put('/:id', auth, creditosDetallesController.updateCreditoDetalle);
router.delete('/:id', auth, creditosDetallesController.deleteCreditoDetalle);

export default router;