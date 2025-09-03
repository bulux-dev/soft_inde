import express from 'express';
import auth from '../../../middleware/auth.js';
import trasladosController from './traslados.controller.js';

let router = express.Router();

router.get('/doc/:traslado_id', trasladosController.getTrasladoDoc);
router.get('/:fecha_inicio/:fecha_fin', auth, trasladosController.getAllTraslados);
router.get('/:id', auth, trasladosController.getOneTraslado);
router.post('/', auth, trasladosController.createTraslado);
router.put('/:id', auth, trasladosController.updateTraslado);
router.delete('/:id', auth, trasladosController.deleteTraslado);

router.put('/anular/:id', auth, trasladosController.anularTraslado);

export default router;