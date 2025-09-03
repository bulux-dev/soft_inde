import express from 'express';
import auth from '../../../middleware/auth.js';
import productosController from './productos.controller.js';

let router = express.Router();

router.get('/', auth, productosController.getAllProductos);
router.get('/categoria', auth, productosController.getAllProductosByCategoria);
router.get('/marca', auth, productosController.getAllProductosByMarca);
router.get('/medida', auth, productosController.getAllProductosByMedida);
router.get('/:id', auth, productosController.getOneProducto);
router.post('/', auth, productosController.createProducto);
router.post('/search/sku', auth, productosController.searchProductoBySKU);
router.post('/search/nombre', auth, productosController.searchProductoByNombre);
router.post('/search/lote', auth, productosController.searchProductoByLote);
router.put('/:id', auth, productosController.updateProducto);
router.delete('/:id', auth, productosController.deleteProducto);

export default router;