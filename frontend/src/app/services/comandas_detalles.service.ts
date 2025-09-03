import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class ComandasDetallesService {

  route: string = '/comandas_detalles';

  constructor(
    private rootService: RootService
  ) { }

  async getComandasDetalles(params: any = null) {
    return await this.rootService.get(this.route, params);
  }

  async getComandaDetalle(id: number) {
    return await this.rootService.get(`${this.route}/${id}`);
  }

  async postComandaDetalle(body: any) {
    return await this.rootService.post(this.route, body);
  }

  async putComandaDetalle(id: number, body: any) {
    return await this.rootService.put(`${this.route}/${id}`, body);
  }

  async deleteComandaDetalle(id: number) {
    return await this.rootService.delete(`${this.route}/${id}`);
  }
}
