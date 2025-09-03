import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class VentasService {

  route: string = '/ventas';

  constructor(
    private rootService: RootService
  ) { }

  async getVentas(fecha_inicio: any, fecha_fin: any, params: any = null) {
    return await this.rootService.get(`${this.route}/${fecha_inicio}/${fecha_fin}`, params);
  }

  async getAllVentasSaldos(params: any = null) {
    return await this.rootService.get(`${this.route}/saldos`, params);
  }

  async getVenta(id: number) {
    return await this.rootService.get(`${this.route}/${id}`);
  }

  async postVenta(body: any) {
    return await this.rootService.post(this.route, body);
  }

  async putVenta(id: number, body: any) {
    return await this.rootService.put(`${this.route}/${id}`, body);
  }

  async anularVenta(id: number, body: any) {
    return await this.rootService.put(`${this.route}/anular/${id}`, body);
  }

  async deleteVenta(id: number) {
    return await this.rootService.delete(`${this.route}/${id}`);
  }
}
