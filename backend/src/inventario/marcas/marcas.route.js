import express from 'express';
import auth from '../../../middleware/auth.js';
import marcasController from './marcas.controller.js';

let router = express.Router();

router.get('/', auth, marcasController.getAllMarcas);
router.get('/:id', auth, marcasController.getOneMarca);
router.post('/', auth, marcasController.createMarca);
router.put('/:id', auth, marcasController.updateMarca);
router.delete('/:id', auth, marcasController.deleteMarca);

export default router;