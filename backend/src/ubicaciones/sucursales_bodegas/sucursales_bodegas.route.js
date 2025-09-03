import express from 'express';
import auth from '../../../middleware/auth.js';
import sucursalesBodegasController from './sucursales_bodegas.controller.js';

let router = express.Router();

router.get('/', auth, sucursalesBodegasController.getAllSucursalesBodegas);
router.get('/:id', auth, sucursalesBodegasController.getOneSucursalBodega);
router.post('/', auth, sucursalesBodegasController.createSucursalBodega);
router.put('/:id', auth, sucursalesBodegasController.updateSucursalBodega);
router.delete('/:id', auth, sucursalesBodegasController.deleteSucursalBodega);

export default router;