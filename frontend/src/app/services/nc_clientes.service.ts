import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class NCClientesService {

  route: string = '/nc_clientes';

  constructor(
    private rootService: RootService
  ) { }

  async getNCClientes(fecha_inicio: any, fecha_fin: any, params: any = null) {
    return await this.rootService.get(`${this.route}/${fecha_inicio}/${fecha_fin}`, params);
  }

  async getNCCliente(id: number) {
    return await this.rootService.get(`${this.route}/${id}`);
  }

  async postNCCliente(body: any) {
    return await this.rootService.post(this.route, body);
  }

  async putNCCliente(id: number, body: any) {
    return await this.rootService.put(`${this.route}/${id}`, body);
  }

  async anularNCCliente(id: number, body: any) {
    return await this.rootService.put(`${this.route}/anular/${id}`, body);
  }
  
  async deleteNCCliente(id: number) {
    return await this.rootService.delete(`${this.route}/${id}`);
  }
}
