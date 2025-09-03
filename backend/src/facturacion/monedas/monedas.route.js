import express from 'express';
import auth from '../../../middleware/auth.js';
import monedasController from './monedas.controller.js';

let router = express.Router();

router.get('/', auth, monedasController.getAllMonedas);
router.get('/:id', auth, monedasController.getOneMoneda);
router.post('/', auth, monedasController.createMoneda);
router.put('/:id', auth, monedasController.updateMoneda);
router.delete('/:id', auth, monedasController.deleteMoneda);

export default router;