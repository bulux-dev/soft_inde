import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class CreditosDetallesService {

  route: string = '/creditos_detalles';

  constructor(
    private rootService: RootService
  ) { }

  async getCreditosDetalles(params: any = null) {
    return await this.rootService.get(this.route, params);
  }

  async getCreditoDetalle(id: number) {
    return await this.rootService.get(`${this.route}/${id}`);
  }

  async postCreditoDetalle(body: any) {
    return await this.rootService.post(this.route, body);
  }

  async putCreditoDetalle(id: number, body: any) {
    return await this.rootService.put(`${this.route}/${id}`, body);
  }

  async deleteCreditoDetalle(id: number) {
    return await this.rootService.delete(`${this.route}/${id}`);
  }

}
