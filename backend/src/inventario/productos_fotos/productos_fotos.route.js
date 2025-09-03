import express from 'express';
import auth from '../../../middleware/auth.js';
import productorFotosController from './productos_fotos.controller.js';

let router = express.Router();

router.get('/', auth, productorFotosController.getAllProductosFotos);
router.get('/:id', auth, productorFotosController.getOneProductoFoto);
router.post('/', auth, productorFotosController.createProductoFoto);
router.put('/:id', auth, productorFotosController.updateProductoFoto);
router.delete('/:id', auth, productorFotosController.deleteProductoFoto);

export default router;