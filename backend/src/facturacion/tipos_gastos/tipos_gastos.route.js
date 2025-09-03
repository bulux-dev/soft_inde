import express from 'express';
import auth from '../../../middleware/auth.js';
import tipos_gastosController from './tipos_gastos.controller.js';

let router = express.Router();

router.get('/', auth, tipos_gastosController.getAllTiposGastos);
router.get('/:id', auth, tipos_gastosController.getOneTipoGasto);
router.post('/', auth, tipos_gastosController.createTipoGasto);
router.put('/:id', auth, tipos_gastosController.updateTipoGasto);
router.delete('/:id', auth, tipos_gastosController.deleteTipoGasto);

export default router;