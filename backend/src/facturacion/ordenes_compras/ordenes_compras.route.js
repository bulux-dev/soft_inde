import express from 'express';
import auth from '../../../middleware/auth.js';
import ordenesComprasController from './ordenes_compras.controller.js';

let router = express.Router();

router.get('/doc/:orden_compra_id', ordenesComprasController.getOrdenCompraDoc);
router.get('/:fecha_inicio/:fecha_fin', auth, ordenesComprasController.getAllOrdenesCompras);
router.get('/:id', auth, ordenesComprasController.getOneOrdenCompra);
router.post('/', auth, ordenesComprasController.createOrdenCompra);
router.put('/:id', auth, ordenesComprasController.updateOrdenCompra);
router.delete('/:id', auth, ordenesComprasController.deleteOrdenCompra);

router.put('/anular/:id', auth, ordenesComprasController.anularOrdenCompra);

export default router;