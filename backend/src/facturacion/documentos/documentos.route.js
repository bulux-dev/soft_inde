import express from 'express';
import auth from '../../../middleware/auth.js';
import documentosController from './documentos.controller.js';

let router = express.Router();

router.get('/', auth, documentosController.getAllDocumentos);
router.get('/:id', auth, documentosController.getOneDocumento);
router.post('/', auth, documentosController.createDocumento);
router.put('/:id', auth, documentosController.updateDocumento);
router.delete('/:id', auth, documentosController.deleteDocumento);

export default router;