import express from 'express';
import auth from '../../../middleware/auth.js';
import categoriasController from './categorias.controller.js';

let router = express.Router();

router.get('/', auth, categoriasController.getAllCategorias);
router.get('/:id', auth, categoriasController.getOneCategoria);
router.post('/', auth, categoriasController.createCategoria);
router.put('/:id', auth, categoriasController.updateCategoria);
router.delete('/:id', auth, categoriasController.deleteCategoria);

router.get('/sucursal/:sucursal_id', auth, categoriasController.getAllCategoriasBySucursal);

export default router;