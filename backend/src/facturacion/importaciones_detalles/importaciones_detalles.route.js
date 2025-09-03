import express from 'express';
import auth from '../../../middleware/auth.js';
import importacionesDetallesController from './importaciones_detalles.controller.js';

let router = express.Router();

router.get('/', auth, importacionesDetallesController.getAllImportacionesDetalles);
router.get('/:id', auth, importacionesDetallesController.getOneImportacionDetalle);
router.post('/', auth, importacionesDetallesController.createImportacionDetalle);
router.put('/:id', auth, importacionesDetallesController.updateImportacionDetalle);
router.delete('/:id', auth, importacionesDetallesController.deleteImportacionDetalle);

export default router;