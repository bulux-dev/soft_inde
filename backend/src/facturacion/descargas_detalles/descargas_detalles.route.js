import express from 'express';
import auth from '../../../middleware/auth.js';
import descargasDetallesController from './descargas_detalles.controller.js';

let router = express.Router();

router.get('/', auth, descargasDetallesController.getAllDescargasDetalles);
router.get('/:id', auth, descargasDetallesController.getOneDescargaDetalle);
router.post('/', auth, descargasDetallesController.createDescargaDetalle);
router.put('/:id', auth, descargasDetallesController.updateDescargaDetalle);
router.delete('/:id', auth, descargasDetallesController.deleteDescargaDetalle);

export default router;