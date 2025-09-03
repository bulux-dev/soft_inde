import express from 'express';
import auth from '../../../middleware/auth.js';
import comandasDetallesController from './comandas_detalles.controller.js';

let router = express.Router();

router.get('/', auth, comandasDetallesController.getAllComandasDetalles);
router.get('/:id', auth, comandasDetallesController.getOneComandaDetalle);
router.post('/', auth, comandasDetallesController.createComandaDetalle);
router.put('/:id', auth, comandasDetallesController.updateComandaDetalle);
router.delete('/:id', auth, comandasDetallesController.deleteComandaDetalle);

export default router;