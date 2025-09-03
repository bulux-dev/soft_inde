import express from 'express';
import auth from '../../../middleware/auth.js';
import cierresContablesController from './cierres_contables.controller.js';

let router = express.Router();

router.get('/', auth, cierresContablesController.getAllCierresContables);   
router.get('/:id', auth, cierresContablesController.getOneCierreContable);   
router.post('/', auth, cierresContablesController.createCierreContable);   
router.put('/:id', auth, cierresContablesController.updateCierreContable);   
router.delete('/:id', auth, cierresContablesController.deleteCierreContable);   

export default router;