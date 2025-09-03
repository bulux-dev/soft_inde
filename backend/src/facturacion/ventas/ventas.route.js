import express from 'express';
import auth from '../../../middleware/auth.js';
import ventasController from './ventas.controller.js';

let router = express.Router();

router.get('/doc/:venta_id', auth, ventasController.getVentaDoc);
router.get('/:fecha_inicio/:fecha_fin', auth, ventasController.getAllVentas);
router.get('/saldos', auth, ventasController.getAllVentasSaldos);
router.get('/:id', auth, ventasController.getOneVenta);
router.post('/', auth, ventasController.createVenta);
router.put('/:id', auth, ventasController.updateVenta);
router.delete('/:id', auth, ventasController.deleteVenta);

router.put('/anular/:id', auth, ventasController.anularVenta);

export default router;