import express from 'express';
import auth from '../../../middleware/auth.js';
import abonosController from './abonos.controller.js';

let router = express.Router();

router.get('/', auth, abonosController.getAllAbonos);
router.get('/:id', auth, abonosController.getOneAbono);
router.post('/', auth, abonosController.createAbono);
router.put('/:id', auth, abonosController.updateAbono);
router.delete('/:id', auth, abonosController.deleteAbono);

export default router;