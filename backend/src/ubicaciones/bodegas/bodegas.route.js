import express from 'express';
import auth from '../../../middleware/auth.js';
import bodegasController from './bodegas.controller.js';

let router = express.Router();

router.get('/', auth, bodegasController.getAllBodegas);
router.get('/:id', auth, bodegasController.getOneBodega);
router.post('/', auth, bodegasController.createBodega);
router.put('/:id', auth, bodegasController.updateBodega);
router.delete('/:id', auth, bodegasController.deleteBodega);

router.get('/sucursal/:sucursal_id', auth, bodegasController.getAllBodegasBySucursal);

export default router;