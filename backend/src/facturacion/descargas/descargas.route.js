import express from 'express';
import auth from '../../../middleware/auth.js';
import descargasController from './descargas.controller.js';

let router = express.Router();

router.get('/doc/:descarga_id', descargasController.getDescargaDoc);
router.get('/:fecha_inicio/:fecha_fin', auth, descargasController.getAllDescargas);
router.get('/:id', auth, descargasController.getOneDescarga);
router.post('/', auth, descargasController.createDescarga);
router.put('/:id', auth, descargasController.updateDescarga);
router.delete('/:id', auth, descargasController.deleteDescarga);

router.put('/anular/:id', auth, descargasController.anularDescarga);

export default router;