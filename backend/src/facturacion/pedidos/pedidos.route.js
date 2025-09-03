import express from 'express';
import auth from '../../../middleware/auth.js';
import pedidosController from './pedidos.controller.js';

let router = express.Router();

router.get('/doc/:pedido_id', auth, pedidosController.getPedidoDoc);
router.get('/:fecha_inicio/:fecha_fin', auth, pedidosController.getAllPedidos);
router.get('/:id', auth, pedidosController.getOnePedido);
router.post('/', auth, pedidosController.createPedido);
router.put('/:id', auth, pedidosController.updatePedido);
router.delete('/:id', auth, pedidosController.deletePedido);

router.put('/anular/:id', auth, pedidosController.anularPedido);

export default router;