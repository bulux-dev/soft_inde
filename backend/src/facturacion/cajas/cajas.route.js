import express from 'express';
import auth from '../../../middleware/auth.js';
import cajasController from './cajas.controller.js';

let router = express.Router();

router.get('/doc/:caja_id', auth, cajasController.getCajaDoc);
router.get('/:fecha_inicio/:fecha_fin', auth, cajasController.getAllCajas);
router.get('/:id', auth, cajasController.getOneCaja);
router.post('/', auth, cajasController.createCaja);
router.put('/:id', auth, cajasController.updateCaja);
router.delete('/:id', auth, cajasController.deleteCaja);

export default router;