import express from 'express';
import auth from '../../../middleware/auth.js'
import rubroController from '../rubros/rubros.controller.js';

let router = express.Router();

router.get('/', auth, rubroController.getAllRubros);
router.get('/jornalizacion', auth, rubroController.getRubrosJornalizacion);
router.get('/:id', auth, rubroController.getOneRubro);
router.post('/', auth, rubroController.createRubro);
router.put('/:id', auth, rubroController.updateRubro);
router.delete('/:id', auth, rubroController.deleteRubro);

export default router;





