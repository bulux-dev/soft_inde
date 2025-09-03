import express from 'express';
import auth from '../../../middleware/auth.js';
import nd_clientesController from './nd_clientes.controller.js';

let router = express.Router();

router.get('/doc/:nd_cliente_id', nd_clientesController.getNDClienteDoc);
router.get('/:fecha_inicio/:fecha_fin', auth, nd_clientesController.getAllNDClientes);
router.get('/:id', auth, nd_clientesController.getOneNDCliente);
router.post('/', auth, nd_clientesController.createNDCliente);
router.put('/:id', auth, nd_clientesController.updateNDCliente);
router.delete('/:id', auth, nd_clientesController.deleteNDCliente);

router.put('/anular/:id', auth, nd_clientesController.anularNDCliente);

export default router;