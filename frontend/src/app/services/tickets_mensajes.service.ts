import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class TicketsMensajesService {

  route: string = '/tickets_mensajes';

  constructor(
    private rootService: RootService
  ) { }

  async getTicketsMensajes(params: any = null) {
    return await this.rootService.get(this.route, params);
  }

  async getTicketMensaje(id: number) {
    return await this.rootService.get(`${this.route}/${id}`);
  }

  async postTicketMensaje(body: any) {
    return await this.rootService.post(this.route, body);
  }

  async putTicketMensaje(id: number, body: any) {
    return await this.rootService.put(`${this.route}/${id}`, body);
  }

  async deleteTicketMensaje(id: number) {
    return await this.rootService.delete(`${this.route}/${id}`);
  }

}
