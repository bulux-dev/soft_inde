import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class CargasDetallesService {

  route: string = '/cargas_detalles';

  constructor(
    private rootService: RootService
  ) { }

  async getCargasDetalles(params: any = null) {
    return await this.rootService.get(this.route, params);
  }

  async getCargaDetalle(id: number) {
    return await this.rootService.get(`${this.route}/${id}`);
  }

  async postCargaDetalle(body: any) {
    return await this.rootService.post(this.route, body);
  }

  async putCargaDetalle(id: number, body: any) {
    return await this.rootService.put(`${this.route}/${id}`, body);
  }

  async deleteCargaDetalle(id: number) {
    return await this.rootService.delete(`${this.route}/${id}`);
  }
}
