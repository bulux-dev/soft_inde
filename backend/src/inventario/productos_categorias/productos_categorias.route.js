import express from 'express';
import auth from '../../../middleware/auth.js';
import productosCategoriasController from './productos_categorias.controller.js';

let router = express.Router();

router.get('/', auth, productosCategoriasController.getAllProductosCategorias);
router.get('/:id', auth, productosCategoriasController.getOneProductoCategoria);
router.post('/', auth, productosCategoriasController.createProductoCategoria);
router.put('/:id', auth, productosCategoriasController.updateProductoCategoria);
router.delete('/:id', auth, productosCategoriasController.deleteProductoCategoria);

export default router;