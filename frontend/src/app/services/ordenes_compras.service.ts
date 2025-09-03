import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class OrdenesComprasService {

  route: string = '/ordenes_compras';

  constructor(
    private rootService: RootService
  ) { }

  async getOrdenesCompras(fecha_inicio: any, fecha_fin: any, params: any = null) {
    return await this.rootService.get(`${this.route}/${fecha_inicio}/${fecha_fin}`, params);
  }

  async getOrdenCompra(id: number) {
    return await this.rootService.get(`${this.route}/${id}`);
  }

  async postOrdenCompra(body: any) {
    return await this.rootService.post(this.route, body);
  }

  async putOrdenCompra(id: number, body: any) {
    return await this.rootService.put(`${this.route}/${id}`, body);
  }

  async anularOrdenCompra(id: number, body: any) {
    return await this.rootService.put(`${this.route}/anular/${id}`, body);
  }

  async deleteOrdenCompra(id: number) {
    return await this.rootService.delete(`${this.route}/${id}`);
  }
}
