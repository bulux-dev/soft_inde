import express from 'express';
import auth from '../../../middleware/auth.js';
import impresorasController from './impresoras.controller.js';

let router = express.Router();

router.get('/', auth, impresorasController.getAllImpresoras);
router.get('/:id', auth, impresorasController.getOneImpresora);
router.post('/', auth, impresorasController.createImpresora);
router.put('/:id', auth, impresorasController.updateImpresora);
router.delete('/:id', auth, impresorasController.deleteImpresora);

export default router;