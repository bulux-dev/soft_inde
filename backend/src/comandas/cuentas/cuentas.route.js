import express from 'express';
import auth from '../../../middleware/auth.js';
import cuentasController from './cuentas.controller.js';

let router = express.Router();

router.get('/', auth, cuentasController.getAllCuentas);
router.get('/display', auth, cuentasController.getAllCuentasDisplay);
router.get('/:id', auth, cuentasController.getOneCuenta);
router.post('/', auth, cuentasController.createCuenta);
router.put('/:id', auth, cuentasController.updateCuenta);
router.delete('/:id', auth, cuentasController.deleteCuenta);

export default router;