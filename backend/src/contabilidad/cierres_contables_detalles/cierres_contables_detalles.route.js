import express from 'express';
import auth from '../../../middleware/auth.js';
import cierresContablesDetallesController from './cierres_contables_detalles.controller.js';

let router = express.Router();

router.get('/', auth, cierresContablesDetallesController.getAllCierresContablesDetalles);   
router.get('/:id', auth, cierresContablesDetallesController.getOneCierreContableDetalle);   
router.post('/', auth, cierresContablesDetallesController.createCierreContableDetalle);   
router.put('/:id', auth, cierresContablesDetallesController.updateCierreContableDetalle);   
router.delete('/:id', auth, cierresContablesDetallesController.deleteCierreContableDetalle);   

export default router;