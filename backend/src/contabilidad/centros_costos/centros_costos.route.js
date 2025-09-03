import express from 'express';
import auth from '../../../middleware/auth.js';
import centro_costosController from './centros_costos.controller.js';

let router = express.Router();

router.get('/', auth, centro_costosController.getAllCentroCostos);
router.get('/jornalizacion', auth, centro_costosController.getCentrosJornalizacion);
router.get('/:id', auth, centro_costosController.getOneCentroCosto);
router.post('/', auth, centro_costosController.createCentroCosto);
router.put('/:id', auth, centro_costosController.updateCentroCosto);
router.delete('/:id', auth, centro_costosController.deleteCentroCosto);

export default router;
