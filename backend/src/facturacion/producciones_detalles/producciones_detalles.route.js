import express from 'express';
import auth from '../../../middleware/auth.js';
import produccionesDetallesController from './producciones_detalles.controller.js';

let router = express.Router();

router.get('/', auth, produccionesDetallesController.getAllProduccionesDetalles);
router.get('/:id', auth, produccionesDetallesController.getOneProduccionDetalle);
router.post('/', auth, produccionesDetallesController.createProduccionDetalle);
router.put('/:id', auth, produccionesDetallesController.updateProduccionDetalle);
router.delete('/:id', auth, produccionesDetallesController.deleteProduccionDetalle);

export default router;