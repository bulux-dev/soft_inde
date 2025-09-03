import express from 'express';
import auth from '../../../middleware/auth.js';
import trasladosDetallesController from './traslados_detalles.controller.js';

let router = express.Router();

router.get('/', auth, trasladosDetallesController.getAllTrasladosDetalles);
router.get('/:id', auth, trasladosDetallesController.getOneTrasladoDetalle);
router.post('/', auth, trasladosDetallesController.createTrasladoDetalle);
router.put('/:id', auth, trasladosDetallesController.updateTrasladoDetalle);
router.delete('/:id', auth, trasladosDetallesController.deleteTrasladoDetalle);

export default router;