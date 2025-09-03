import express from 'express';
import auth from '../../../middleware/auth.js';
import permisosController from './permisos.controller.js';

let router = express.Router();

router.get('/', auth, permisosController.getAllPermisos);
router.get('/rol_usuario', auth, permisosController.getAllPermisosByRolUsuario);
router.get('/:id', auth, permisosController.getOnePermiso);
router.post('/', auth, permisosController.createPermiso);
router.put('/:id', auth, permisosController.updatePermiso);
router.delete('/:id', auth, permisosController.deletePermiso);

export default router;