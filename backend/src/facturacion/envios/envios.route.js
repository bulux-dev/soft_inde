import express from 'express';
import auth from '../../../middleware/auth.js';
import enviosController from './envios.controller.js';

let router = express.Router();

router.get('/doc/:envio_id', auth, enviosController.getEnvioDoc);
router.get('/:fecha_inicio/:fecha_fin', auth, enviosController.getAllEnvios);
router.get('/:id', auth, enviosController.getOneEnvio);
router.post('/', auth, enviosController.createEnvio);
router.put('/:id', auth, enviosController.updateEnvio);
router.delete('/:id', auth, enviosController.deleteEnvio);

router.put('/anular/:id', auth, enviosController.anularEnvio);

export default router;