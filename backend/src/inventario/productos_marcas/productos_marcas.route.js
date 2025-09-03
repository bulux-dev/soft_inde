import express from 'express';
import auth from '../../../middleware/auth.js';
import productorMarcasController from './productos_marcas.controller.js';

let router = express.Router();

router.get('/', auth, productorMarcasController.getAllProductosMarcas);
router.get('/:id', auth, productorMarcasController.getOneProductoMarca);
router.post('/', auth, productorMarcasController.createProductoMarca);
router.put('/:id', auth, productorMarcasController.updateProductoMarca);
router.delete('/:id', auth, productorMarcasController.deleteProductoMarca);

export default router;