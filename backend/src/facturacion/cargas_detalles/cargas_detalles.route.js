import express from 'express';
import auth from '../../../middleware/auth.js';
import cargasDetallesController from './cargas_detalles.controller.js';

let router = express.Router();

router.get('/', auth, cargasDetallesController.getAllCargasDetalles);
router.get('/:id', auth, cargasDetallesController.getOneCargaDetalle);
router.post('/', auth, cargasDetallesController.createCargaDetalle);
router.put('/:id', auth, cargasDetallesController.updateCargaDetalle);
router.delete('/:id', auth, cargasDetallesController.deleteCargaDetalle);

export default router;