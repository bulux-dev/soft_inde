import express from 'express';
import auth from '../../../middleware/auth.js';
import notas_debitosController from './notas_debitos.controller.js';

let router = express.Router();

router.get('/doc/:nota_debito_id', notas_debitosController.getNotaDebitoDoc);
router.get('/:fecha_inicio/:fecha_fin', auth, notas_debitosController.getAllNotasDebitos);
router.get('/:id', auth, notas_debitosController.getOneNotaDebito);
router.post('/', auth, notas_debitosController.createNotaDebito);
router.put('/:id', auth, notas_debitosController.updateNotaDebito);
router.delete('/:id', auth, notas_debitosController.deleteNotaDebito);

router.put('/anular/:id', auth, notas_debitosController.anularNotaDebito);

export default router;