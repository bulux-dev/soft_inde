import express from 'express';
import auth from '../../../middleware/auth.js';
import cuentasBancariasController from './cuentas_bancarias.controller.js';

let router = express.Router();

router.get('/', auth, cuentasBancariasController.getAllCuentasBancarias);
router.get('/:id', auth, cuentasBancariasController.getOneCuentaBancaria);
router.post('/', auth, cuentasBancariasController.createCuentaBancaria);
router.put('/:id', auth, cuentasBancariasController.updateCuentaBancaria);
router.delete('/:id', auth, cuentasBancariasController.deleteCuentaBancaria);

export default router;