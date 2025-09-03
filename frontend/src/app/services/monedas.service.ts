import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class MonedasService {

  route: string = '/monedas';

  constructor(
    private rootService: RootService
  ) { }

  async getMonedas(params: any = null) {
    return await this.rootService.get(this.route, params);
  }

  async getMoneda(id: number) {
    return await this.rootService.get(`${this.route}/${id}`);
  }

  async postMoneda(body: any) {
    return await this.rootService.post(this.route, body);
  }

  async putMoneda(id: number, body: any) {
    return await this.rootService.put(`${this.route}/${id}`, body);
  }

  async deleteMoneda(id: number) {
    return await this.rootService.delete(`${this.route}/${id}`);
  }

}
