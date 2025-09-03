import express from 'express';
import auth from '../../../middleware/auth.js';
import recibosDetallesController from './recibos_detalles.controller.js';

let router = express.Router();

router.get('/', auth, recibosDetallesController.getAllRecibosDetalles);
router.get('/:id', auth, recibosDetallesController.getOneReciboDetalle);
router.post('/', auth, recibosDetallesController.createReciboDetalle);
router.put('/:id', auth, recibosDetallesController.updateReciboDetalle);
router.delete('/:id', auth, recibosDetallesController.deleteReciboDetalle);

export default router;