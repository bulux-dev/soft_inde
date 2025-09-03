import express from 'express';
import authController from './auth.controller.js';

let router = express.Router();

router.post('/login', authController.login);
router.post('/registro', authController.registro);
router.post('/recuperar', authController.recuperar);

export default router;