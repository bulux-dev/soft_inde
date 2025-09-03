import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class PedidosService {

  route: string = '/pedidos';

  constructor(
    private rootService: RootService
  ) { }

  async getPedidos(fecha_inicio: any, fecha_fin: any, params: any = null) {
    return await this.rootService.get(`${this.route}/${fecha_inicio}/${fecha_fin}`, params);
  }
  
  async getPedido(id: number) {
    return await this.rootService.get(`${this.route}/${id}`);
  }

  async postPedido(body: any) {
    return await this.rootService.post(this.route, body);
  }

  async putPedido(id: number, body: any) {
    return await this.rootService.put(`${this.route}/${id}`, body);
  }

  async anularPedido(id: number, body: any) {
    return await this.rootService.put(`${this.route}/anular/${id}`, body);
  }

  async deletePedido(id: number) {
    return await this.rootService.delete(`${this.route}/${id}`);
  }
}
