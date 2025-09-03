import express from 'express';
import webController from './web.controller.js';

let router = express.Router();

router.get('/categorias', webController.getCategorias);
router.get('/marcas', webController.getMarcas);
router.get('/productos/categoria/:categoria_id', webController.getProductosByCategoria);
router.get('/productos/marca/:marca_id', webController.getProductosByMarca);
router.get('/productos/:id', webController.getOneProducto);

router.get('/', webController.getWebs);
router.get('/:id', webController.getWeb);
router.post('/', webController.createWeb);
router.put('/:id', webController.updateWeb);
router.delete('/:id', webController.deleteWeb);

export default router;