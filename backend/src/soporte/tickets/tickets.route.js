import express from 'express';
import auth from '../../../middleware/auth.js';
import ticketsController from './tickets.controller.js';

let router = express.Router();

router.get('/', auth, ticketsController.getAllTickets);
router.get('/:id', auth, ticketsController.getOneTicket);
router.post('/', auth, ticketsController.createTicket);
router.put('/:id', auth, ticketsController.updateTicket);
router.put('/cerrar/:id', auth, ticketsController.cerrarTicket);
router.delete('/:id', auth, ticketsController.deleteTicket);

export default router;