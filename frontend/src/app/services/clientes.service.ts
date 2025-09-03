import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  route: string = '/clientes';

  constructor(
    private rootService: RootService
  ) { }

  async getClientes(params: any = null) {
    return await this.rootService.get(this.route, params);
  }

  async getCliente(id: number) {
    return await this.rootService.get(`${this.route}/${id}`);
  }

  async postCliente(body: any) {
    return await this.rootService.post(this.route, body);
  }

  async putCliente(id: number, body: any) {
    return await this.rootService.put(`${this.route}/${id}`, body);
  }

  async deleteCliente(id: number) {
    return await this.rootService.delete(`${this.route}/${id}`);
  }

}
