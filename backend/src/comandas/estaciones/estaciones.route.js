import express from 'express';
import auth from '../../../middleware/auth.js';
import estacionesController from './estaciones.controller.js';

let router = express.Router();

router.get('/', auth, estacionesController.getAllEstaciones);
router.get('/:id', auth, estacionesController.getOneEstacion);
router.post('/', auth, estacionesController.createEstacion);
router.put('/:id', auth, estacionesController.updateEstacion);
router.delete('/:id', auth, estacionesController.deleteEstacion);

export default router;