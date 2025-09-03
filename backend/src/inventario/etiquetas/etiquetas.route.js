import express from 'express';
import auth from '../../../middleware/auth.js';
import etiquetasController from './etiquetas.controller.js';

let router = express.Router();

router.get('/', auth, etiquetasController.getAllEtiquetas);
router.get('/:id', auth, etiquetasController.getOneEtiqueta);
router.post('/', auth, etiquetasController.createEtiqueta);
router.put('/:id', auth, etiquetasController.updateEtiqueta);
router.delete('/:id', auth, etiquetasController.deleteEtiqueta);

export default router;