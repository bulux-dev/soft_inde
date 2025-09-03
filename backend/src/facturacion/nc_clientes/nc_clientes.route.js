import express from 'express';
import auth from '../../../middleware/auth.js';
import nc_clientesController from './nc_clientes.controller.js';

let router = express.Router();

router.get('/doc/:nc_cliente_id', nc_clientesController.getNCClienteDoc);
router.get('/:fecha_inicio/:fecha_fin', auth, nc_clientesController.getAllNCClientes);
router.get('/:id', auth, nc_clientesController.getOneNCCliente);
router.post('/', auth, nc_clientesController.createNCCliente);
router.put('/:id', auth, nc_clientesController.updateNCCliente);
router.delete('/:id', auth, nc_clientesController.deleteNCCliente);

router.put('/anular/:id', auth, nc_clientesController.anularNCCliente);

export default router;