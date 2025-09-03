import express from 'express';
import auth from '../../../middleware/auth.js';
import partidas_automaticasController from './partidas_automaticas.controller.js';

let router = express.Router();

router.get('/', auth, partidas_automaticasController.getAllPartidasAutomaticas);
router.get('/:id', auth, partidas_automaticasController.getOnePartidaAutomatica);
router.post('/', auth, partidas_automaticasController.createPartidaAutomatica);
router.put('/:id', auth, partidas_automaticasController.updatePartidaAutomatica);
router.delete('/:id', auth, partidas_automaticasController.deletePartidaAutomatica);

export default router;



