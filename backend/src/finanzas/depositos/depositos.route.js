import express from 'express';
import auth from '../../../middleware/auth.js';
import depositosController from './depositos.controller.js';

let router = express.Router();

router.get('/doc/:deposito_id', depositosController.getDepositoDoc);
router.get('/:fecha_inicio/:fecha_fin', auth, depositosController.getAllDepositos);
router.get('/:id', auth, depositosController.getOneDeposito);
router.post('/', auth, depositosController.createDeposito);
router.put('/:id', auth, depositosController.updateDeposito);
router.delete('/:id', auth, depositosController.deleteDeposito);

router.put('/anular/:id', auth, depositosController.anularDeposito);

export default router;