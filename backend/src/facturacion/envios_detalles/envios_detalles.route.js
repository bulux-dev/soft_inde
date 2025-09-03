import express from 'express';
import auth from '../../../middleware/auth.js';
import enviosDetallesController from './envios_detalles.controller.js';

let router = express.Router();

router.get('/', auth, enviosDetallesController.getAllEnviosDetalles);
router.get('/:id', auth, enviosDetallesController.getOneEnvioDetalle);
router.post('/', auth, enviosDetallesController.createEnvioDetalle);
router.put('/:id', auth, enviosDetallesController.updateEnvioDetalle);
router.delete('/:id', auth, enviosDetallesController.deleteEnvioDetalle);

export default router;