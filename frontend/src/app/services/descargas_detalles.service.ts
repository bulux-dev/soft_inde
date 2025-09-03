import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class DescargasDetallesService {

  route: string = '/descargas_detalles';

  constructor(
    private rootService: RootService
  ) { }

  async getDescargasDetalles(params: any = null) {
    return await this.rootService.get(this.route, params);
  }

  async getDescargaDetalle(id: number) {
    return await this.rootService.get(`${this.route}/${id}`);
  }

  async postDescargaDetalle(body: any) {
    return await this.rootService.post(this.route, body);
  }

  async putDescargaDetalle(id: number, body: any) {
    return await this.rootService.put(`${this.route}/${id}`, body);
  }

  async deleteDescargaDetalle(id: number) {
    return await this.rootService.delete(`${this.route}/${id}`);
  }
}
