import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class NDClientesService {

  route: string = '/nd_clientes';

  constructor(
    private rootService: RootService
  ) { }

  async getNDClientes(fecha_inicio: any, fecha_fin: any, params: any = null) {
    return await this.rootService.get(`${this.route}/${fecha_inicio}/${fecha_fin}`, params);
  }

  async getNDCliente(id: number) {
    return await this.rootService.get(`${this.route}/${id}`);
  }

  async postNDCliente(body: any) {
    return await this.rootService.post(this.route, body);
  }

  async putNDCliente(id: number, body: any) {
    return await this.rootService.put(`${this.route}/${id}`, body);
  }

  async anularNDCliente(id: number, body: any) {
    return await this.rootService.put(`${this.route}/anular/${id}`, body);
  }
  
  async deleteNDCliente(id: number) {
    return await this.rootService.delete(`${this.route}/${id}`);
  }
}
