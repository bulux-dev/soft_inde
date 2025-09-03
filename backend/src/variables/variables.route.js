import express from 'express';
import auth from '../../middleware/auth.js';
import variablesController from './variables.controller.js';

let router = express.Router();

router.get('/', auth, variablesController.getAllVariables);
router.get('/:slug', auth, variablesController.getOneVariable);
router.post('/', auth, variablesController.createVariable);
router.put('/:slug', auth, variablesController.updateVariable);
router.delete('/:slug', auth, variablesController.deleteVariable);

export default router;