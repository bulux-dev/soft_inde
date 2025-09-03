import express from 'express';
import auth from '../../../middleware/auth.js';
import sucursalesController from './sucursales.controller.js';

let router = express.Router();

router.get('/', auth, sucursalesController.getAllSucursales);
router.get('/:id', auth, sucursalesController.getOneSucursal);
router.post('/', auth, sucursalesController.createSucursal);
router.put('/:id', auth, sucursalesController.updateSucursal);
router.delete('/:id', auth, sucursalesController.deleteSucursal);

export default router;