import express from 'express';
import auth from '../../../middleware/auth.js';
import terminosController from './terminos.controller.js';

let router = express.Router();

router.get('/', auth, terminosController.getAllTerminos);
router.get('/:id', auth, terminosController.getOneTermino);
router.post('/', auth, terminosController.createTermino);
router.put('/:id', auth, terminosController.updateTermino);
router.delete('/:id', auth, terminosController.deleteTermino);

export default router;