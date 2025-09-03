import express from 'express';
import auth from '../../../middleware/auth.js';
import cargasController from './cargas.controller.js';

let router = express.Router();

router.get('/doc/:carga_id', cargasController.getCargaDoc);
router.get('/:fecha_inicio/:fecha_fin', auth, cargasController.getAllCargas);
router.get('/:id', auth, cargasController.getOneCarga);
router.post('/', auth, cargasController.createCarga);
router.put('/:id', auth, cargasController.updateCarga);
router.delete('/:id', auth, cargasController.deleteCarga);

router.put('/anular/:id', auth, cargasController.anularCarga);

export default router;