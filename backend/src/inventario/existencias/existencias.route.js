import express from 'express';
import auth from '../../../middleware/auth.js';
import existenciasController from './existencias.controller.js';

let router = express.Router();

router.get('/', auth, existenciasController.getAllExistencias);
router.get('/stocks', auth, existenciasController.getAllExistenciaStock);
router.get('/stock', auth, existenciasController.getExistenciaStock);
router.get('/kardex/:fecha_inicio/:fecha_fin', auth, existenciasController.getAllExistenciasKardex);
router.get('/:id', auth, existenciasController.getOneExistencia);
router.post('/', auth, existenciasController.createExistencia);
router.put('/:id', auth, existenciasController.updateExistencia);
router.delete('/:id', auth, existenciasController.deleteExistencia);

export default router;