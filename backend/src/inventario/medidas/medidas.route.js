import express from 'express';
import auth from '../../../middleware/auth.js';
import medidasController from './medidas.controller.js';

let router = express.Router();

router.get('/', auth, medidasController.getAllMedidas);
router.get('/:id', auth, medidasController.getOneMedida);
router.post('/', auth, medidasController.createMedida);
router.put('/:id', auth, medidasController.updateMedida);
router.delete('/:id', auth, medidasController.deleteMedida);

export default router;