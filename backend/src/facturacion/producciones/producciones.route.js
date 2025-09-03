import express from 'express';
import auth from '../../../middleware/auth.js';
import produccionesController from './producciones.controller.js';

let router = express.Router();

router.get('/doc/:produccion_id', produccionesController.getProduccionDoc);
router.get('/:fecha_inicio/:fecha_fin', auth, produccionesController.getAllProducciones);
router.get('/:id', auth, produccionesController.getOneProduccion);
router.post('/', auth, produccionesController.createProduccion);
router.put('/:id', auth, produccionesController.updateProduccion);
router.delete('/:id', auth, produccionesController.deleteProduccion);

router.put('/anular/:id', auth, produccionesController.anularProduccion);

export default router;