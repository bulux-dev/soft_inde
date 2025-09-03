import express from 'express';
import auth from '../../../middleware/auth.js';
import creditosController from './creditos.controller.js';

let router = express.Router();

router.get('/doc/:credito_id', auth, creditosController.getCreditoDoc);
router.get('/cotizacion/:credito_id', auth, creditosController.getCreditoCotizacion);
router.get('/solicitud/:credito_id', auth, creditosController.getCreditoSolicitud);
router.get('/estado-cuenta/:fecha_fin/:credito_id', auth, creditosController.getCreditoEstadoCuenta);
router.get('/:fecha_inicio/:fecha_fin', auth, creditosController.getAllCreditos);
router.get('/:id', auth, creditosController.getOneCredito);
router.post('/', auth, creditosController.createCredito);
router.put('/:id', auth, creditosController.updateCredito);
router.delete('/:id', auth, creditosController.deleteCredito);

router.put('/anular/:id', auth, creditosController.anularCredito);

export default router;