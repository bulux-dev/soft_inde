import express from 'express';
import auth from '../../../middleware/auth.js';
import ticketsMensajesController from './tickets_mensajes.controller.js';

let router = express.Router();

router.get('/', auth, ticketsMensajesController.getAllTicketsMensajes);
router.get('/:id', auth, ticketsMensajesController.getOneTicketMensaje);
router.post('/', auth, ticketsMensajesController.createTicketMensaje);
router.put('/:id', auth, ticketsMensajesController.updateTicketMensaje);
router.delete('/:id', auth, ticketsMensajesController.deleteTicketMensaje);

export default router;