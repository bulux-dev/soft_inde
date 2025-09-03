import express from 'express';
import auth from '../../../middleware/auth.js';
import partidasDetallesController from './partidas_detalles.controller.js';

let router = express.Router();

router.get('/', auth, partidasDetallesController.getAllPartidasDetalles);
router.get('/:id', auth, partidasDetallesController.getOnePartidaDetalle);
router.post('/', auth, partidasDetallesController.createPartidaDetalle);
router.put('/:id', auth, partidasDetallesController.updatePartidaDetalle);
router.delete('/:id', auth, partidasDetallesController.deletePartidaDetalle);

export default router;
