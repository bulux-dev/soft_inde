import express from 'express';
import auth from '../../../middleware/auth.js';
import comprasDetallesController from './compras_detalles.controller.js';

let router = express.Router();

router.get('/', auth, comprasDetallesController.getAllComprasDetalles);
router.get('/:id', auth, comprasDetallesController.getOneCompraDetalle);
router.post('/', auth, comprasDetallesController.createCompraDetalle);
router.put('/:id', auth, comprasDetallesController.updateCompraDetalle);
router.delete('/:id', auth, comprasDetallesController.deleteCompraDetalle);

export default router;