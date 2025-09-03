import express from 'express';
import auth from '../../../middleware/auth.js';
import erroresController from './errores.controller.js';

let router = express.Router();

router.get('/', auth, erroresController.getAllErrores);
router.get('/:id', auth, erroresController.getOneError);
router.post('/', auth, erroresController.createError);
router.put('/:id', auth, erroresController.updateError);
router.delete('/:id', auth, erroresController.deleteError);

export default router;