import express from 'express';
import auth from '../../../middleware/auth.js';
import comandasController from './comandas.controller.js';

let router = express.Router();

router.get('/', auth, comandasController.getAllComandas);
router.get('/display', auth, comandasController.getAllComandasDisplay);
router.get('/:id', auth, comandasController.getOneComanda);
router.post('/', auth, comandasController.createComanda);
router.put('/:id', auth, comandasController.updateComanda); 
router.delete('/:id', auth, comandasController.deleteComanda);

export default router;