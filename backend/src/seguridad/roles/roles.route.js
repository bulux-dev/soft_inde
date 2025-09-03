import express from 'express';
import auth from '../../../middleware/auth.js';
import rolesController from './roles.controller.js';

let router = express.Router();

router.get('/', auth, rolesController.getAllRoles);
router.get('/:id', auth, rolesController.getOneRol);
router.post('/', auth, rolesController.createRol);
router.put('/:id', auth, rolesController.updateRol);
router.delete('/:id', auth, rolesController.deleteRol);

export default router;