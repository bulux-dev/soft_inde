import express from 'express';
import auth from '../../../middleware/auth.js';
import productosCategoriasController from './operaciones_etiquetas.controller.js';

let router = express.Router();

router.get('/', auth, productosCategoriasController.getAllOperacionesEtiquetas);
router.get('/:id', auth, productosCategoriasController.getOneOperacionEtiqueta);
router.post('/', auth, productosCategoriasController.createOperacionEtiqueta);
router.put('/:id', auth, productosCategoriasController.updateOperacionEtiqueta);
router.delete('/:id', auth, productosCategoriasController.deleteOperacionEtiqueta);

export default router;