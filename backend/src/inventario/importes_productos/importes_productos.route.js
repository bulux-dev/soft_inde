import express from 'express';
import auth from '../../../middleware/auth.js';
import importes_productosController from './importes_productos.controller.js';

let router = express.Router();

router.get('/', auth, importes_productosController.getAllImportesProductos);
router.get('/:id', auth, importes_productosController.getOneImporteProducto);
router.post('/', auth, importes_productosController.createImporteProducto);
router.put('/:id', auth, importes_productosController.updateImporteProducto);
router.delete('/:id', auth, importes_productosController.deleteImporteProducto);

export default router;