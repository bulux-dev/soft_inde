import express from 'express';
import auth from '../../../middleware/auth.js';
import pedidosDetallesController from './pedidos_detalles.controller.js';

let router = express.Router();

router.get('/', auth, pedidosDetallesController.getAllPedidosDetalles);
router.get('/:id', auth, pedidosDetallesController.getOnePedidoDetalle);
router.post('/', auth, pedidosDetallesController.createPedidoDetalle);
router.put('/:id', auth, pedidosDetallesController.updatePedidoDetalle);
router.delete('/:id', auth, pedidosDetallesController.deletePedidoDetalle);

export default router;