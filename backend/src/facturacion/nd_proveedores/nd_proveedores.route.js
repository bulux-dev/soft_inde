import express from 'express';
import auth from '../../../middleware/auth.js';
import nd_proveedoresController from './nd_proveedores.controller.js';

let router = express.Router();

router.get('/doc/:nd_proveedor_id', nd_proveedoresController.getNDProveedorDoc);
router.get('/:fecha_inicio/:fecha_fin', auth, nd_proveedoresController.getAllNDProveedores);
router.get('/:id', auth, nd_proveedoresController.getOneNDProveedor);
router.post('/', auth, nd_proveedoresController.createNDProveedor);
router.put('/:id', auth, nd_proveedoresController.updateNDProveedor);
router.delete('/:id', auth, nd_proveedoresController.deleteNDProveedor);

router.put('/anular/:id', auth, nd_proveedoresController.anularNDProveedor);

export default router;