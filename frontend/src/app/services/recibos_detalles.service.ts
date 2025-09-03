import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class RecibosDetallesService {

  route: string = '/recibos_detalles';

  constructor(
    private rootService: RootService
  ) { }

  async getRecibosDetalles(params: any = null) {
    return await this.rootService.get(this.route, params);
  }

  async getReciboDetalle(id: number) {
    return await this.rootService.get(`${this.route}/${id}`);
  }

  async postReciboDetalle(body: any) {
    return await this.rootService.post(this.route, body);
  }

  async putReciboDetalle(id: number, body: any) {
    return await this.rootService.put(`${this.route}/${id}`, body);
  }

  async deleteReciboDetalle(id: number) {
    return await this.rootService.delete(`${this.route}/${id}`);
  }
}
