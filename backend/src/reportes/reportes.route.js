import express from 'express';
import auth from '../../middleware/auth.js';
import reportesController from './reportes.controller.js';

let router = express.Router();

router.get('/ordenes_compras', auth, reportesController.reporteOrdenesCompras);
router.get('/cotizaciones', auth, reportesController.reporteCotizaciones);
router.get('/pedidos', auth, reportesController.reportePedidos);
router.get('/envios', auth, reportesController.reporteEnvios);
router.get('/ventas', auth, reportesController.reporteVentas);
router.get('/compras', auth, reportesController.reporteCompras);
router.get('/cargas', auth, reportesController.reporteCargas);
router.get('/descargas', auth, reportesController.reporteDescargas);
router.get('/traslados', auth, reportesController.reporteTraslados);
router.get('/importaciones', auth, reportesController.reporteImportaciones);
router.get('/recibos', auth, reportesController.reporteRecibos);
router.get('/cheques', auth, reportesController.reporteCheques);
router.get('/depositos', auth, reportesController.reporteDepositos);
router.get('/notas_debitos', auth, reportesController.reporteNotasDebitos);
router.get('/notas_creditos', auth, reportesController.reporteNotasCreditos);
router.get('/nc_clientes', auth, reportesController.reporteNCClientes);
router.get('/nd_clientes', auth, reportesController.reporteNDClientes);
router.get('/nc_proveedores', auth, reportesController.reporteNCProveedores);
router.get('/nd_proveedores', auth, reportesController.reporteNDProveedores);

router.get('/libro_bancos', auth, reportesController.reporteLibroBancos);

router.get('/ventas/:fecha_inicio/:fecha_fin', auth, reportesController.reporteVentasNew);
router.get('/libro_diario/:fecha_inicio/:fecha_fin', auth, reportesController.libroDiario);

export default router;