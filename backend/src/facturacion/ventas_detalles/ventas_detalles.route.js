import express from 'express';
import auth from '../../../middleware/auth.js';
import ventasDetallesController from './ventas_detalles.controller.js';

let router = express.Router();

router.get('/', auth, ventasDetallesController.getAllVentasDetalles);
router.get('/:id', auth, ventasDetallesController.getOneVentaDetalle);
router.post('/', auth, ventasDetallesController.createVentaDetalle);
router.put('/:id', auth, ventasDetallesController.updateVentaDetalle);
router.delete('/:id', auth, ventasDetallesController.deleteVentaDetalle);

export default router;