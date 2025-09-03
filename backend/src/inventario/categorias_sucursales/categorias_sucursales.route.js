import express from 'express';
import auth from '../../../middleware/auth.js';
import productosCategoriasController from './categorias_sucursales.controller.js';

let router = express.Router();

router.get('/', auth, productosCategoriasController.getAllCategoriasSucursales);
router.get('/:id', auth, productosCategoriasController.getOneCategoriaSucursal);
router.post('/', auth, productosCategoriasController.createCategoriaSucursal);
router.put('/:id', auth, productosCategoriasController.updateCategoriaSucursal);
router.delete('/:id', auth, productosCategoriasController.deleteCategoriaSucursal);

export default router;