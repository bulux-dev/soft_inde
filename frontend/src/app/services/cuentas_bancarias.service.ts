import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class CuentasBancariasService {

  route: string = '/cuentas_bancarias';

  constructor(
    private rootService: RootService
  ) { }

  async getCuentasBancarias(params: any = null) {
    return await this.rootService.get(this.route, params);
  }

  async getCuentaBancaria(id: number) {
    return await this.rootService.get(`${this.route}/${id}`);
  }

  async postCuentaBancaria(body: any) {
    return await this.rootService.post(this.route, body);
  }

  async putCuentaBancaria(id: number, body: any) {
    return await this.rootService.put(`${this.route}/${id}`, body);
  }

  async deleteCuentaBancaria(id: number) {
    return await this.rootService.delete(`${this.route}/${id}`);
  }

}
