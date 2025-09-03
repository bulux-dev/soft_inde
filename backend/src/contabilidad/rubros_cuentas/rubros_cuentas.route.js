import express from 'express';
import auth from '../../../middleware/auth.js';
import rubros_cuentasController from './rubros_cuentas.controller.js';


let router = express.Router();

router.get('/', auth, rubros_cuentasController.getAllRubrosCuentas);
router.get('/:id', auth, rubros_cuentasController.getOneRubroCuenta);
router.post('/', auth, rubros_cuentasController.createRubroCuenta);
router.put('/:id', auth, rubros_cuentasController.updateRubroCuenta);
router.delete('/:id', auth, rubros_cuentasController.deleteRubroCuenta);

export default router;