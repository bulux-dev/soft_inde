import express from 'express';
import auth from '../../../middleware/auth.js';
import comerciosController from './comercios.controller.js';

let router = express.Router();

router.get('/', auth, comerciosController.getAllComercios);
router.get('/arbol', auth, comerciosController.getAllComerciosArbol);
router.get('/:id', auth, comerciosController.getOneComercio);
router.post('/', auth, comerciosController.createComercio);
router.put('/:id', auth, comerciosController.updateComercio);
router.delete('/:id', auth, comerciosController.deleteComercio);

export default router;