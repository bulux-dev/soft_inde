import express from 'express';
import auth from '../../../middleware/auth.js';
import tipos_productosController from './tipos_productos.controller.js';

let router = express.Router();

router.get('/', auth, tipos_productosController.getAllTiposProductos);
router.get('/:id', auth, tipos_productosController.getOneTipoProducto);
router.post('/', auth, tipos_productosController.createTipoProducto);
router.put('/:id', auth, tipos_productosController.updateTipoProducto);
router.delete('/:id', auth, tipos_productosController.deleteTipoProducto);

export default router;