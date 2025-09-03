import express from 'express';
import auth from '../../../middleware/auth.js';
import comprasController from './compras.controller.js';

let router = express.Router();

router.get('/doc/:compra_id', comprasController.getCompraDoc);
router.get('/:fecha_inicio/:fecha_fin', auth, comprasController.getAllCompras);
router.get('/saldos', auth, comprasController.getAllComprasSaldos);
router.get('/:id', auth, comprasController.getOneCompra);
router.post('/', auth, comprasController.createCompra);
router.put('/:id', auth, comprasController.updateCompra);
router.delete('/:id', auth, comprasController.deleteCompra);

router.put('/anular/:id', auth, comprasController.anularCompra);

export default router;