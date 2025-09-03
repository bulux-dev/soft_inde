import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class AmortizacionesService {

  route: string = '/amortizaciones';

  constructor(
    private rootService: RootService
  ) { }

  async getAmortizaciones(params: any = null) {
    return await this.rootService.get(this.route, params);
  }

  async getAmortizacion(id: number) {
    return await this.rootService.get(`${this.route}/${id}`);
  }

  async postAmortizacion(body: any) {
    return await this.rootService.post(this.route, body);
  }

  async putAmortizacion(id: number, body: any) {
    return await this.rootService.put(`${this.route}/${id}`, body);
  }

  async deleteAmortizacion(id: number) {
    return await this.rootService.delete(`${this.route}/${id}`);
  }

}
