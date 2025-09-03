import express from 'express';
import auth from '../../../middleware/auth.js';
import areasController from './areas.controller.js';

let router = express.Router();

router.get('/', auth, areasController.getAllAreas);
router.get('/:id', auth, areasController.getOneArea);
router.post('/', auth, areasController.createArea);
router.put('/:id', auth, areasController.updateArea);
router.delete('/:id', auth, areasController.deleteArea);

export default router;