import express from 'express';
import auth from '../../../middleware/auth.js';
import recetasController from './recetas.controller.js';

let router = express.Router();

router.get('/', auth, recetasController.getAllRecetas);
router.get('/:id', auth, recetasController.getOneReceta);
router.post('/', auth, recetasController.createReceta);
router.put('/:id', auth, recetasController.updateReceta);
router.delete('/:id', auth, recetasController.deleteReceta);

export default router;