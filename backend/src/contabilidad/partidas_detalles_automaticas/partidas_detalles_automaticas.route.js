import express from 'express';
import auth from '../../../middleware/auth.js';
import partidasDetallesAutomaticasController from '../partidas_detalles_automaticas/partidas_detalles_automaticas.controller.js';

let router = express.Router();

router.get('/', auth, partidasDetallesAutomaticasController.getAllPartidaDetallesAutomaticas);
router.get('/:id', auth, partidasDetallesAutomaticasController.getOnePartidaDetalleAutomatica);
router.post('/', auth, partidasDetallesAutomaticasController.createPartidaDetalleAutomatica);
router.put('/:id', auth, partidasDetallesAutomaticasController.updatePartidaDetalleAutomatica);
router.delete('/:id', auth, partidasDetallesAutomaticasController.deletePartidaDetalleAutomatica);

export default router;

