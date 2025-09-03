import express from 'express';
import auth from '../../../middleware/auth.js';
import valoresController from './valores.controller.js';

let router = express.Router();

router.get('/', auth, valoresController.getAllValores);
router.get('/:id', auth, valoresController.getOneValor);
router.post('/', auth, valoresController.createValor);
router.put('/:id', auth, valoresController.updateValor);
router.delete('/:id', auth, valoresController.deleteValor);

export default router;