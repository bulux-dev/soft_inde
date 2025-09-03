import express from 'express';
import auth from '../../../middleware/auth.js';
import cotizacionesDetallesController from './cotizaciones_detalles.controller.js';

let router = express.Router();

router.get('/', auth, cotizacionesDetallesController.getAllCotizacionesDetalles);
router.get('/:id', auth, cotizacionesDetallesController.getOneCotizacionDetalle);
router.post('/', auth, cotizacionesDetallesController.createCotizacionDetalle);
router.put('/:id', auth, cotizacionesDetallesController.updateCotizacionDetalle);
router.delete('/:id', auth, cotizacionesDetallesController.deleteCotizacionDetalle);

export default router;