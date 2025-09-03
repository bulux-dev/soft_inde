import express from 'express';
import auth from '../../../middleware/auth.js';
import ordenesComprasDetallesController from './ordenes_compras_detalles.controller.js';

let router = express.Router();

router.get('/', auth, ordenesComprasDetallesController.getAllOrdenesComprasDetalles);
router.get('/:id', auth, ordenesComprasDetallesController.getOneOrdenCompraDetalle);
router.post('/', auth, ordenesComprasDetallesController.createOrdenCompraDetalle);
router.put('/:id', auth, ordenesComprasDetallesController.updateOrdenCompraDetalle);
router.delete('/:id', auth, ordenesComprasDetallesController.deleteOrdenCompraDetalle);

export default router;