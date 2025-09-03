import express from 'express';
import auth from '../../../middleware/auth.js';
import productosMedidasController from './productos_medidas.controller.js';

let router = express.Router();

router.get('/', auth, productosMedidasController.getAllProductosMedidas);
router.get('/:id', auth, productosMedidasController.getOneProductoMedida);
router.post('/', auth, productosMedidasController.createProductoMedida);
router.put('/:id', auth, productosMedidasController.updateProductoMedida);
router.delete('/:id', auth, productosMedidasController.deleteProductoMedida);

export default router;