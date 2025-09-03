import express from 'express';
import auth from '../../../middleware/auth.js';
import cotizacionesController from './cotizaciones.controller.js';

let router = express.Router();

router.get('/doc/:cotizacion_id', auth, cotizacionesController.getCotizacionDoc);
router.get('/:fecha_inicio/:fecha_fin', auth, cotizacionesController.getAllCotizaciones);
router.get('/:id', auth, cotizacionesController.getOneCotizacion);
router.post('/', auth, cotizacionesController.createCotizacion);
router.put('/:id', auth, cotizacionesController.updateCotizacion);
router.delete('/:id', auth, cotizacionesController.deleteCotizacion);

router.put('/anular/:id', auth, cotizacionesController.anularCotizacion);

export default router;