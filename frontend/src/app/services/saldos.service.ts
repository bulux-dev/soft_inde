import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class SaldosService {

  route: string = '/saldos';

  constructor(
    private rootService: RootService
  ) { }

  async getSaldos(params: any = null) {
    return await this.rootService.get(this.route, params);
  }

  async getSaldosCXC(params: any = null) {
    return await this.rootService.get(`${this.route}/cxc`, params);
  }

  async getSaldosCXCCliente(cliente_id: any, params: any = null) {
    return await this.rootService.get(`${this.route}/cxc/${cliente_id}`, params);
  }

  async getSaldosCXCAcum(cliente_id: any, params: any = null) {
    return await this.rootService.get(`${this.route}/cxc/acumulado/${cliente_id}`, params);
  }

  async getSaldosCXP(params: any = null) {
    return await this.rootService.get(`${this.route}/cxp`, params);
  }

  async getSaldosCXPProveedor(proveedor_id: any, params: any = null) {
    return await this.rootService.get(`${this.route}/cxp/${proveedor_id}`, params);
  }

  async getSaldosCXPAcum(proveedor_id: any, params: any = null) {
    return await this.rootService.get(`${this.route}/cxp/acumulado/${proveedor_id}`, params);
  }


  async getSaldo(id: number) {
    return await this.rootService.get(`${this.route}/${id}`);
  }

  async postSaldo(body: any) {
    return await this.rootService.post(this.route, body);
  }

  async putSaldo(id: number, body: any) {
    return await this.rootService.put(`${this.route}/${id}`, body);
  }

  async deleteSaldo(id: number) {
    return await this.rootService.delete(`${this.route}/${id}`);
  }

}
