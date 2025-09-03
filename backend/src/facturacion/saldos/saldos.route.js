import express from 'express';
import auth from '../../../middleware/auth.js';
import saldosController from './saldos.controller.js';

let router = express.Router();

router.get('/', auth, saldosController.getAllSaldos);
router.get('/cxc', auth, saldosController.getAllSaldosCXC);
router.get('/cxc/:cliente_id', auth, saldosController.getAllSaldosCXCCliente);
router.get('/cxc/acumulado/:cliente_id', auth, saldosController.getAllSaldosCXCAcum);
router.get('/cxp', auth, saldosController.getAllSaldosCXP);
router.get('/cxp/:proveedor_id', auth, saldosController.getAllSaldosCXPProveedor);
router.get('/cxp/acumulado/:proveedor_id', auth, saldosController.getAllSaldosCXPAcum);
router.get('/:id', auth, saldosController.getOneSaldo);
router.post('/', auth, saldosController.createSaldo);
router.put('/:id', auth, saldosController.updateSaldo);
router.delete('/:id', auth, saldosController.deleteSaldo);

export default router;