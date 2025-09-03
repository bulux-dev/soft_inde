import express from 'express';
import auth from '../../../middleware/auth.js';
import recibosController from './recibos.controller.js';

let router = express.Router();

router.get('/doc/:recibo_id', auth, recibosController.getReciboDoc);
router.get('/:fecha_inicio/:fecha_fin', auth, recibosController.getAllRecibos);
router.get('/saldos', auth, recibosController.getAllRecibosSaldos);
router.get('/:id', auth, recibosController.getOneRecibo);
router.post('/', auth, recibosController.createRecibo);
router.put('/:id', auth, recibosController.updateRecibo);
router.delete('/:id', auth, recibosController.deleteRecibo);

router.put('/anular/:id', auth, recibosController.anularRecibo);

export default router;