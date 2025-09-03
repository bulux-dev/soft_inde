import express from 'express';
import auth from '../../../middleware/auth.js';
import clientesController from './clientes.controller.js';

let router = express.Router();

router.get('/', auth, clientesController.getAllClientes);

router.get('/cxc', auth, clientesController.reporteCXC);
router.get('/cxc/:id', auth, clientesController.reporteCXCCliente);
router.get('/cxc/detalle/:id', auth, clientesController.reporteCXCClienteDetalle);

router.get('/:id', auth, clientesController.getOneCliente);
router.post('/', auth, clientesController.createCliente);
router.put('/:id', auth, clientesController.updateCliente);
router.delete('/:id', auth, clientesController.deleteCliente);

export default router;