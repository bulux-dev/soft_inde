import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class VariacionesDetallesService {

  route: string = '/variaciones_detalles';

  constructor(
    private rootService: RootService
  ) { }

  async getVariacionesDetalles(params: any = null) {
    return await this.rootService.get(this.route, params);
  }

  async getVariacionDetalle(id: number) {
    return await this.rootService.get(`${this.route}/${id}`);
  }

  async postVariacionDetalle(body: any) {
    return await this.rootService.post(this.route, body);
  }

  async putVariacionDetalle(id: number, body: any) {
    return await this.rootService.put(`${this.route}/${id}`, body);
  }

  async deleteVariacionDetalle(id: number) {
    return await this.rootService.delete(`${this.route}/${id}`);
  }
}
