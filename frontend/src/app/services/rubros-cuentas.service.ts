import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class RubrosCuentasService {

  route: string = '/rubros_cuentas';


  constructor(
    private rootService: RootService
  ) { }
  
  async getRubrosCuentas(params: any = null) {
    return await this.rootService.get(this.route, params);
  }

  async getRubroCuenta(id: number) {
    return await this.rootService.get(`${this.route}/${id}`);
  }

  async postRubroCuenta(body: any) {
    return await this.rootService.post(this.route, body);
  }

  async putRubroCuenta(id: number, body: any) {
    return await this.rootService.put(`${this.route}/${id}`, body);
  }

  async deleteRubroCuenta(id: number) {
    return await this.rootService.delete(`${this.route}/${id}`);
  }
  async getRubrosCuentasByCuenta(id: number) {
    return await this.rootService.get(`/admin/contabilidad/cuentas-contables/${id}`);
  }
  async getAllCuentasContables(){
    return await this.rootService.get(`/admin/contabilidad/cuentas-contables`);
  }
  async getRubrosJornalizacion(params: any = null) {
    const options = params ? { params } : {};
    return await this.rootService.get(`${this.route}/jornalizacion`, params);
  }
}
