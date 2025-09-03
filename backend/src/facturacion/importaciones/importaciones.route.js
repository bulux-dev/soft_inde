import express from 'express';
import auth from '../../../middleware/auth.js';
import importacionesController from './importaciones.controller.js';

let router = express.Router();

router.get('/doc/:importacion_id', importacionesController.getImportacionDoc);
router.get('/:fecha_inicio/:fecha_fin', auth, importacionesController.getAllImportaciones);
router.get('/saldos', auth, importacionesController.getAllImportacionesSaldos);
router.get('/:id', auth, importacionesController.getOneImportacion);
router.post('/', auth, importacionesController.createImportacion);
router.put('/:id', auth, importacionesController.updateImportacion);
router.delete('/:id', auth, importacionesController.deleteImportacion);

router.put('/anular/:id', auth, importacionesController.anularImportacion);

export default router;