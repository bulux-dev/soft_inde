import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class VentasDetallesService {

  route: string = '/ventas_detalles';

  constructor(
    private rootService: RootService
  ) { }

  async getVentasDetalles(params: any = null) {
    return await this.rootService.get(this.route, params);
  }

  async getVentaDetalle(id: number) {
    return await this.rootService.get(`${this.route}/${id}`);
  }

  async postVentaDetalle(body: any) {
    return await this.rootService.post(this.route, body);
  }

  async putVentaDetalle(id: number, body: any) {
    return await this.rootService.put(`${this.route}/${id}`, body);
  }

  async deleteVentaDetalle(id: number) {
    return await this.rootService.delete(`${this.route}/${id}`);
  }
}
