import express from 'express';
import auth from '../../middleware/auth.js';
import dashboardController from './dashboard.controller.js';

let router = express.Router();

router.get('/seguridad', auth, dashboardController.seguridad);
router.get('/personal', auth, dashboardController.personal);
router.get('/operaciones/:fecha_inicio/:fecha_fin', auth, dashboardController.operaciones);
router.get('/compras/:fecha_inicio/:fecha_fin', auth, dashboardController.compras);
router.get('/ventas/:fecha_inicio/:fecha_fin', auth, dashboardController.ventas);
router.get('/cotizaciones/:fecha_inicio/:fecha_fin', auth, dashboardController.cotizaciones);
router.get('/pedidos/:fecha_inicio/:fecha_fin', auth, dashboardController.pedidos);
router.get('/ordenes_compras/:fecha_inicio/:fecha_fin', auth, dashboardController.ordenes_compras);

export default router;