import express from 'express';
import auth from '../../../middleware/auth.js';
import nc_proveedoresController from './nc_proveedores.controller.js';

let router = express.Router();

router.get('/doc/:nc_proveedor_id', nc_proveedoresController.getNCProveedorDoc);
router.get('/:fecha_inicio/:fecha_fin', auth, nc_proveedoresController.getAllNCProveedores);
router.get('/:id', auth, nc_proveedoresController.getOneNCProveedor);
router.post('/', auth, nc_proveedoresController.createNCProveedor);
router.put('/:id', auth, nc_proveedoresController.updateNCProveedor);
router.delete('/:id', auth, nc_proveedoresController.deleteNCProveedor);

router.put('/anular/:id', auth, nc_proveedoresController.anularNCProveedor);

export default router;