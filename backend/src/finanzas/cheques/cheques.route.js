import express from 'express';
import auth from '../../../middleware/auth.js';
import chequesController from './cheques.controller.js';

let router = express.Router();

router.get('/doc/:cheque_id', chequesController.getChequeDoc);
router.get('/:fecha_inicio/:fecha_fin', auth, chequesController.getAllCheques);
router.get('/:id', auth, chequesController.getOneCheque);
router.post('/', auth, chequesController.createCheque);
router.put('/:id', auth, chequesController.updateCheque);
router.delete('/:id', auth, chequesController.deleteCheque);

router.put('/anular/:id', auth, chequesController.anularCheque);

export default router;