import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class CuentasService {

  route: string = '/cuentas';

  constructor(
    private rootService: RootService
  ) { }

  async getCuentas(params: any = null) {
    return await this.rootService.get(this.route, params);
  }

  async getCuentasDisplay(params: any = null) {
    return await this.rootService.get(`${this.route}/display`, params);
  }

  async getCuenta(id: number) {
    return await this.rootService.get(`${this.route}/${id}`);
  }

  async postCuenta(body: any) {
    return await this.rootService.post(this.route, body);
  }

  async putCuenta(id: number, body: any) {
    return await this.rootService.put(`${this.route}/${id}`, body);
  }

  async deleteCuenta(id: number) {
    return await this.rootService.delete(`${this.route}/${id}`);
  }

}
