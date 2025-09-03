import express from 'express';
import auth from '../../../middleware/auth.js';
import proveedoresController from './proveedores.controller.js';

let router = express.Router();

router.get('/', auth, proveedoresController.getAllProveedores);

router.get('/cxp', auth, proveedoresController.reporteCXP);
router.get('/cxp/:id', auth, proveedoresController.reporteCXPProveedor);
router.get('/cxp/detalle/:id', auth, proveedoresController.reporteCXPProveedorDetalle);

router.get('/:id', auth, proveedoresController.getOneProveedor);
router.post('/', auth, proveedoresController.createProveedor);
router.put('/:id', auth, proveedoresController.updateProveedor);
router.delete('/:id', auth, proveedoresController.deleteProveedor);

export default router;