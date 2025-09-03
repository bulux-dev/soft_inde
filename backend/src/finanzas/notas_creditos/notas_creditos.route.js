import express from 'express';
import auth from '../../../middleware/auth.js';
import notas_creditosController from './notas_creditos.controller.js';

let router = express.Router();

router.get('/doc/:nota_credito_id', notas_creditosController.getNotaCreditoDoc);
router.get('/:fecha_inicio/:fecha_fin', auth, notas_creditosController.getAllNotasCreditos);
router.get('/:id', auth, notas_creditosController.getOneNotaCredito);
router.post('/', auth, notas_creditosController.createNotaCredito);
router.put('/:id', auth, notas_creditosController.updateNotaCredito);
router.delete('/:id', auth, notas_creditosController.deleteNotaCredito);

router.put('/anular/:id', auth, notas_creditosController.anularNotaCredito);

export default router;