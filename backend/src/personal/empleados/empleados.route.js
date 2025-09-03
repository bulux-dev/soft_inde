import express from 'express';
import auth from '../../../middleware/auth.js';
import empleadosController from './empleados.controller.js';

let router = express.Router();

router.get('/', auth, empleadosController.getAllEmpleados);
router.get('/:id', auth, empleadosController.getOneEmpleado);
router.post('/', auth, empleadosController.createEmpleado);
router.put('/:id', auth, empleadosController.updateEmpleado);
router.delete('/:id', auth, empleadosController.deleteEmpleado);

export default router;