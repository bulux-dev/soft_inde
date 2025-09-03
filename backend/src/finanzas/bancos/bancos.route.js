import express from 'express';
import auth from '../../../middleware/auth.js';
import bancosController from './bancos.controller.js';

let router = express.Router();

router.get('/', auth, bancosController.getAllBancos);
router.get('/:id', auth, bancosController.getOneBanco);
router.post('/', auth, bancosController.createBanco);
router.put('/:id', auth, bancosController.updateBanco);
router.delete('/:id', auth, bancosController.deleteBanco);

export default router;