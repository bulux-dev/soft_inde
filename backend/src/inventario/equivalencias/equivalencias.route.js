import express from 'express';
import auth from '../../../middleware/auth.js';
import equivalenciasController from './equivalencias.controller.js';

let router = express.Router();

router.get('/', auth, equivalenciasController.getAllEquivalencias);
router.get('/:id', auth, equivalenciasController.getOneEquivalencia);
router.post('/', auth, equivalenciasController.createEquivalencia);
router.put('/:id', auth, equivalenciasController.updateEquivalencia);
router.delete('/:id', auth, equivalenciasController.deleteEquivalencia);

export default router;