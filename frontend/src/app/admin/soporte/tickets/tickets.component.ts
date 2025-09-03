import { Component, Input } from '@angular/core';
import { TicketsService } from '../../../services/tickets.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AlertasService } from '../../../services/alertas.service';
import { FormControl, FormGroup } from '@angular/forms';
import moment from 'moment';
import { TicketsMensajesService } from '../../../services/tickets_mensajes.service';
import { ErroresService } from '../../../services/errores.service';

declare var $: any;
declare var Jodit: any;

@Component({
  selector: 'app-tickets',
  standalone: false,
  templateUrl: './tickets.component.html',
  styleUrl: './tickets.component.css'
})
export class TicketsComponent {

  @Input() error_id: any;
  tickets: any = [];
  ticket: any;
  mensaje: any = '';
  usuario_id: any = localStorage.getItem('usuario_id');
  isMobile: any = ((/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)));

  ticketForm: FormGroup = new FormGroup({
    fecha: new FormControl(null),
    estado: new FormControl(null),
    asunto: new FormControl(null),
    descripcion: new FormControl(null),
    error_id: new FormControl(null),
    usuario_id: new FormControl(null)
  })

  constructor(
    private ngxService: NgxUiLoaderService,
    private tickets_service: TicketsService,
    private tickets_mensajes_service: TicketsMensajesService,
    private errores_service: ErroresService,
    private alertas_service: AlertasService,
  ) { }

  async ngOnInit() {
    await this.getTickets();
    const editor = Jodit.make('#editor');
    if (this.error_id) {
      let error = await this.errores_service.getError(this.error_id);
      this.ticketForm.controls['asunto'].setValue(error.data.tipo);
      this.ticketForm.controls['error_id'].setValue(error.data.id);
      editor.value = error.data.mensaje;
      $('#abrir-ticket').offcanvas('show');
    }
    setInterval(async () => {
      if (this.ticket) {
        this.getMensajes(this.ticket);
      }
    }, 1000);
  }

  async getTickets() {
    this.ngxService.start();
    let tickets = await this.tickets_service.getTickets();
    if (tickets.code) {
      this.tickets = tickets.data;
    }
    this.ngxService.stop();
  }

  async postTicket() {
    this.ngxService.start();
    this.ticketForm.controls['fecha'].setValue(moment().format('YYYY-MM-DD HH:mm'));
    this.ticketForm.controls['estado'].setValue('Abierto');
    let editor: any = document.getElementById('editor');
    this.ticketForm.controls['descripcion'].setValue(editor.value);
    this.ticketForm.controls['usuario_id'].setValue(localStorage.getItem('usuario_id'));
    let ticket = await this.tickets_service.postTicket(this.ticketForm.value);
    if (ticket.code) {
      this.alertas_service.success(ticket.mensaje);
      $('#abrir-ticket').offcanvas('hide');
      this.ticketForm.reset();
      await this.getTickets();
      await this.setTicket(ticket.data);
      this.ngxService.stop();
    }
  }

  async getMensajes(i: any) {
    let ticket = await this.tickets_service.getTicket(i.id);
    if (ticket.code) {
      if (this.ticket.tickets_mensajes.length != ticket.data.tickets_mensajes.length) {
        this.scrollToBottom();
      }
      this.ticket.tickets_mensajes = ticket.data.tickets_mensajes;
    }
  }

  async setTicket(i: any) {
    this.ngxService.start();
    if (this.isMobile) {
      $('#detalle-ticket').offcanvas('show');
    }
    let ticket = await this.tickets_service.getTicket(i.id);
    this.ticket = ticket.data;
    this.ticketForm.patchValue(i);
    this.ngxService.stop();
    this.scrollToBottom();
  }

  async deleteTicket(id: any) {
    this.ngxService.start();
    let ticket = await this.tickets_service.deleteTicket(id);
    if (ticket.code) {
      this.alertas_service.success(ticket.mensaje);
      await this.getTickets();
    }
    this.ngxService.stop();
  }

  async closeTicket(i: any) {
    this.alertas_service.cerrar().then(async (result: any) => {
      if (result.isConfirmed && !result.value) {
        await this.closeTicket(i);
        return;
      }
      if (result.isConfirmed && result.value) {
        this.ngxService.start();
        let ticket = await this.tickets_service.cerrarTicket(i.id, i);
        if (ticket.code) {
          this.alertas_service.success(ticket.mensaje);
          this.ticket = null;
          $('#detalle-ticket').offcanvas('hide');
          await this.getTickets();
        }
        this.ngxService.stop();
      }
    });
  }

  ago(date: string) {
    let fecha = moment(date);
    let hoy = moment();
    let diff = hoy.diff(fecha, 'days');
    if (diff > 5) {
      return moment(date).format('DD/MM/YYYY HH:mm');
    }
    return moment(date).fromNow();
  }

  async postTicketMensaje() {
    let ticket_mensaje = await this.tickets_mensajes_service.postTicketMensaje({
      fecha: moment().format('YYYY-MM-DD HH:mm'),
      mensaje: this.mensaje,
      ticket_id: this.ticket.id,
      usuario_id: this.usuario_id
    });
    if (ticket_mensaje.code) {
      this.ticket.tickets_mensajes.push(ticket_mensaje.data);
      this.scrollToBottom();
      this.mensaje = '';
    }
  }

  scrollToBottom() {
    setTimeout(() => {
      const elemento: any = document.getElementById(`msg${this.ticket.tickets_mensajes.length - 1}`);
      elemento.scrollIntoView({ behavior: "smooth" });
      $('#input-mensaje').focus();
    }, 1000);
  }

}
