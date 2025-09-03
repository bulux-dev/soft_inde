import express from 'express';
import auth from '../../../middleware/auth.js';
import importaciones_gastosController from './importaciones_gastos.controller.js';

let router = express.Router();

router.get('/doc/:importacion_gasto_id', importaciones_gastosController.getImportacionGastoDoc);
router.get('/:fecha_inicio/:fecha_fin', auth, importaciones_gastosController.getAllImportacionesGastos);
router.get('/:id', auth, importaciones_gastosController.getOneImportacionGasto);
router.post('/', auth, importaciones_gastosController.createImportacionGasto);
router.put('/:id', auth, importaciones_gastosController.updateImportacionGasto);
router.delete('/:id', auth, importaciones_gastosController.deleteImportacionGasto);

router.put('/anular/:id', auth, importaciones_gastosController.anularImportacionGasto);

export default router;