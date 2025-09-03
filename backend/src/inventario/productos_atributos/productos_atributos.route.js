import express from 'express';
import auth from '../../../middleware/auth.js';
import productorAtributosController from './productos_atributos.controller.js';

let router = express.Router();

router.get('/', auth, productorAtributosController.getAllProductosAtributos);
router.get('/:id', auth, productorAtributosController.getOneProductoAtributo);
router.post('/', auth, productorAtributosController.createProductoAtributo);
router.put('/:id', auth, productorAtributosController.updateProductoAtributo);
router.delete('/:id', auth, productorAtributosController.deleteProductoAtributo);

router.get('/producto/:producto_id', auth, productorAtributosController.getAllProductoAtributosByProducto);

export default router;