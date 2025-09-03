import express from 'express';
import auth from '../../../middleware/auth.js';
import productosPreciosController from './productos_precios.controller.js';

let router = express.Router();

router.get('/', auth, productosPreciosController.getAllProductosPrecios);
router.get('/:id', auth, productosPreciosController.getOneProductoPrecio);
router.post('/', auth, productosPreciosController.createProductoPrecio);
router.put('/:id', auth, productosPreciosController.updateProductoPrecio);
router.delete('/:id', auth, productosPreciosController.deleteProductoPrecio);

export default router;