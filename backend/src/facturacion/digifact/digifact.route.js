import express from 'express';
import auth from '../../../middleware/auth.js';
import digifactController from './digifact.controller.js';

let router = express.Router();

router.get('/token', auth, digifactController.getToken);
router.get('/nit/:nit', auth, digifactController.getInfoNit);
router.get('/dte/:fecha', auth, digifactController.getInfoDte);
router.post('/certificar', auth, digifactController.certificacionFel);
router.post('/anular', auth, digifactController.anulacionFel);

export default router;