import express from 'express';
import auth from '../../../middleware/auth.js';
import atributosController from './atributos.controller.js';

let router = express.Router();

router.get('/', auth, atributosController.getAllAtributos);
router.get('/:id', auth, atributosController.getOneAtributo);
router.post('/', auth, atributosController.createAtributo);
router.put('/:id', auth, atributosController.updateAtributo);
router.delete('/:id', auth, atributosController.deleteAtributo);

export default router;