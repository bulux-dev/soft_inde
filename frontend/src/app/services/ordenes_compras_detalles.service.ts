import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class OrdenesComprasDetallesService {

  route: string = '/ordenes_compras_detalles';

  constructor(
    private rootService: RootService
  ) { }

  async getOrdenesComprasDetalles(params: any = null) {
    return await this.rootService.get(this.route, params);
  }

  async getOrdenCompraDetalle(id: number) {
    return await this.rootService.get(`${this.route}/${id}`);
  }

  async postOrdenCompraDetalle(body: any) {
    return await this.rootService.post(this.route, body);
  }

  async putOrdenCompraDetalle(id: number, body: any) {
    return await this.rootService.put(`${this.route}/${id}`, body);
  }

  async deleteOrdenCompraDetalle(id: number) {
    return await this.rootService.delete(`${this.route}/${id}`);
  }
}
