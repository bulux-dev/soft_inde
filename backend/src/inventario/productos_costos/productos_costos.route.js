import express from 'express';
import auth from '../../../middleware/auth.js';
import productosCostosController from './productos_costos.controller.js';

let router = express.Router();

router.get('/', auth, productosCostosController.getAllProductosCostos);
router.get('/:id', auth, productosCostosController.getOneProductoCosto);
router.post('/', auth, productosCostosController.createProductoCosto);
router.put('/:id', auth, productosCostosController.updateProductoCosto);
router.delete('/:id', auth, productosCostosController.deleteProductoCosto);

export default router;