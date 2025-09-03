import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class PagosService {

  route: string = '/pagos';

  constructor(
    private rootService: RootService
  ) { }

  async getPagos(params: any = null) {
    return await this.rootService.get(this.route, params);
  }

  async getPago(id: number) {
    return await this.rootService.get(`${this.route}/${id}`);
  }

  async postPago(body: any) {
    return await this.rootService.post(this.route, body);
  }

  async putPago(id: number, body: any) {
    return await this.rootService.put(`${this.route}/${id}`, body);
  }

  async deletePago(id: number) {
    return await this.rootService.delete(`${this.route}/${id}`);
  }

}
