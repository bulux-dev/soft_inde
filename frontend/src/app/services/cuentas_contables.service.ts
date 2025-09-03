import { Injectable } from '@angular/core';
import { RootService } from './root.service';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CuentasContablesService {

  route: string = '/cuentas_contables';

  constructor(
    private rootService: RootService,
    private http: HttpClient
  ) { }

  async getCuentasContables(params: any = null) {
    return await this.rootService.get(this.route, params);
  }
async getCuentasJornalizacion(params: any = null) {
  const options = params ? { params } : {};
  return await this.rootService.get(`${this.route}/jornalizacion`, params);
}
  async getCuentaContable(id: number) {
    return await this.rootService.get(`${this.route}/${id}`);
  }

  async postCuentaContable(body: any) {
    return await this.rootService.post(this.route, body);
  }

  async putCuentaContable(id: number, body: any) {
    return await this.rootService.put(`${this.route}/${id}`, body);
  }

  async deleteCuentaContable(id: number) {
    return await this.rootService.delete(`${this.route}/${id}`);
  }

}