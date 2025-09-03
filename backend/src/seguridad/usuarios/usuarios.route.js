import express from 'express';
import auth from '../../../middleware/auth.js';
import usuariosController from './usuarios.controller.js';

let router = express.Router();

router.get('/', auth, usuariosController.getAllUsuarios);
router.get('/:id', auth, usuariosController.getOneUsuario);
router.post('/', auth, usuariosController.createUsuario);
router.put('/:id', auth, usuariosController.updateUsuario);
router.delete('/:id', auth, usuariosController.deleteUsuario);

export default router;