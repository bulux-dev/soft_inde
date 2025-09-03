import express from 'express';
import auth from '../../../middleware/auth.js';
import cajasChicasController from './cajas_chicas.controller.js';

let router = express.Router();

router.get('/', auth, cajasChicasController.getAllCajasChicas);
router.get('/:id', auth, cajasChicasController.getOneCajaChica);
router.post('/', auth, cajasChicasController.createCajaChica);
router.put('/:id', auth, cajasChicasController.updateCajaChica);
router.delete('/:id', auth, cajasChicasController.deleteCajaChica);

export default router;