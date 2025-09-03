import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class ComprasDetallesService {

  route: string = '/compras_detalles';

  constructor(
    private rootService: RootService
  ) { }

  async getComprasDetalles(params: any = null) {
    return await this.rootService.get(this.route, params);
  }

  async getCompraDetalle(id: number) {
    return await this.rootService.get(`${this.route}/${id}`);
  }

  async postCompraDetalle(body: any) {
    return await this.rootService.post(this.route, body);
  }

  async putCompraDetalle(id: number, body: any) {
    return await this.rootService.put(`${this.route}/${id}`, body);
  }

  async deleteCompraDetalle(id: number) {
    return await this.rootService.delete(`${this.route}/${id}`);
  }
}
