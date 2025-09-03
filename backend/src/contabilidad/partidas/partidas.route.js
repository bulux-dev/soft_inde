import express from 'express';
import auth from '../../../middleware/auth.js';
import partidasController from './partidas.controller.js';

let router = express.Router();

router.get('/', auth, partidasController.getAllPartidas);
router.get('/:id', auth, partidasController.getOnePartida);
router.post('/', auth, partidasController.createPartida);
router.put('/:id', auth, partidasController.updatePartida);
router.delete('/:id', auth, partidasController.deletePartida);

export default router;

