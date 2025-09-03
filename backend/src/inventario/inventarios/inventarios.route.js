import express from 'express';
import auth from '../../../middleware/auth.js';
import inventariosController from './inventarios.controller.js';

let router = express.Router();

router.get('/', auth, inventariosController.getAllInventarios);
router.get('/:id', auth, inventariosController.getOneInventario);
router.post('/', auth, inventariosController.createInventario);
router.post('/cierre', auth, inventariosController.cierreInventario);
router.put('/:id', auth, inventariosController.updateInventario);
router.delete('/:id', auth, inventariosController.deleteInventario);

export default router;