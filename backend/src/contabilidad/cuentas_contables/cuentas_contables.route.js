import express from 'express';
import auth from '../../../middleware/auth.js';
import cuentasContablesController from './cuentas_contables.controller.js';

let router = express.Router();

router.get('/', auth, cuentasContablesController.getAllCuentasContables);
router.get('/jornalizacion', auth, cuentasContablesController.getCuentasJornalizacion);
router.get('/:id', auth, cuentasContablesController.getOneCuentaContable);
router.post('/', auth, cuentasContablesController.createCuentaContable);
router.put('/:id', auth, cuentasContablesController.updateCuentaContable);
router.delete('/:id', auth, cuentasContablesController.deleteCuentaContable);

export default router;