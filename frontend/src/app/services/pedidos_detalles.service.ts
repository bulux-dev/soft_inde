import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class PedidosDetallesService {

  route: string = '/pedidos_detalles';

  constructor(
    private rootService: RootService
  ) { }

  async getPedidosDetalles(params: any = null) {
    return await this.rootService.get(this.route, params);
  }

  async getPedidoDetalle(id: number) {
    return await this.rootService.get(`${this.route}/${id}`);
  }

  async postPedidoDetalle(body: any) {
    return await this.rootService.post(this.route, body);
  }

  async putPedidoDetalle(id: number, body: any) {
    return await this.rootService.put(`${this.route}/${id}`, body);
  }

  async deletePedidoDetalle(id: number) {
    return await this.rootService.delete(`${this.route}/${id}`);
  }
}
