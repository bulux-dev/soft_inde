import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class TicketsService {

  route: string = '/tickets';

  constructor(
    private rootService: RootService
  ) { }

  async getTickets(params: any = null) {
    return await this.rootService.get(this.route, params);
  }

  async getTicket(id: number) {
    return await this.rootService.get(`${this.route}/${id}`);
  }

  async postTicket(body: any) {
    return await this.rootService.post(this.route, body);
  }

  async putTicket(id: number, body: any) {
    return await this.rootService.put(`${this.route}/${id}`, body);
  }

  async cerrarTicket(id: number, body: any) {
    return await this.rootService.put(`${this.route}/cerrar/${id}`, body);
  }

  async deleteTicket(id: number) {
    return await this.rootService.delete(`${this.route}/${id}`);
  }

}
