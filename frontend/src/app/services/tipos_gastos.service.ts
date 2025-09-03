import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class TiposGastosService {

  route: string = '/tipos_gastos';

  constructor(
    private rootService: RootService
  ) { }

  async getTiposGastos(params: any = null) {
    return await this.rootService.get(this.route, params);
  }

  async getTipoGasto(id: number) {
    return await this.rootService.get(`${this.route}/${id}`);
  }

  async postTipoGasto(body: any) {
    return await this.rootService.post(this.route, body);
  }

  async putTipoGasto(id: number, body: any) {
    return await this.rootService.put(`${this.route}/${id}`, body);
  }

  async deleteTipoGasto(id: number) {
    return await this.rootService.delete(`${this.route}/${id}`);
  }

}
