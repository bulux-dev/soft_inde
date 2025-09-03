import express from 'express';
import auth from '../../../middleware/auth.js';
import TiposDocumentosController from './tipos_documentos.controller.js';

let router = express.Router();

router.get('/', auth, TiposDocumentosController.getAllTiposDocumentos);
router.get('/:id', auth, TiposDocumentosController.getOneTipoDocumento);
router.post('/', auth, TiposDocumentosController.createTipoDocumento);
router.put('/:id', auth, TiposDocumentosController.updateTipoDocumento);
router.delete('/:id', auth, TiposDocumentosController.deleteTipoDocumento);

export default router;