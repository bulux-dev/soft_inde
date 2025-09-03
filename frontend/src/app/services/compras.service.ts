import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class ComprasService {

  route: string = '/compras';

  constructor(
    private rootService: RootService
  ) { }

  async getCompras(fecha_inicio: any, fecha_fin: any, params: any = null) {
    return await this.rootService.get(`${this.route}/${fecha_inicio}/${fecha_fin}`, params);
  }

  async getAllComprasSaldos(params: any = null) {
    return await this.rootService.get(`${this.route}/saldos`, params);
  }

  async getCompra(id: number) {
    return await this.rootService.get(`${this.route}/${id}`);
  }

  async postCompra(body: any) {
    return await this.rootService.post(this.route, body);
  }

  async putCompra(id: number, body: any) {
    return await this.rootService.put(`${this.route}/${id}`, body);
  }

  async anularCompra(id: number, body: any) {
    return await this.rootService.put(`${this.route}/anular/${id}`, body);
  }

  async deleteCompra(id: number) {
    return await this.rootService.delete(`${this.route}/${id}`);
  }
}
