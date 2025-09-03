import express from 'express';
import auth from '../../../middleware/auth.js';
import lotesController from './lotes.controller.js';

let router = express.Router();

router.get('/', auth, lotesController.getAllLotes);
router.get('/existentes', auth, lotesController.getAllLotesExistentes);
router.get('/:id', auth, lotesController.getOneLote);
router.post('/', auth, lotesController.createLote);
router.put('/:id', auth, lotesController.updateLote);
router.delete('/:id', auth, lotesController.deleteLote);

export default router;