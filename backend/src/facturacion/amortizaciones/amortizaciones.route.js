import express from 'express';
import auth from '../../../middleware/auth.js';
import amortizacionesController from './amortizaciones.controller.js';

let router = express.Router();

router.get('/', auth, amortizacionesController.getAllAmortizaciones);
router.get('/:id', auth, amortizacionesController.getOneAmortizacion);
router.post('/', auth, amortizacionesController.createAmortizacion);
router.put('/:id', auth, amortizacionesController.updateAmortizacion);
router.delete('/:id', auth, amortizacionesController.deleteAmortizacion);

router.get('/recibo/:id', auth, amortizacionesController.getReciboAmortizacion);

export default router;