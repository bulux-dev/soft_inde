import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class DepositosService {

  route: string = '/depositos';

  constructor(
    private rootService: RootService
  ) { }

  async getDepositos(fecha_inicio: any, fecha_fin: any, params: any = null) {
    return await this.rootService.get(`${this.route}/${fecha_inicio}/${fecha_fin}`, params);
  }

  async getDeposito(id: number) {
    return await this.rootService.get(`${this.route}/${id}`);
  }

  async postDeposito(body: any) {
    return await this.rootService.post(this.route, body);
  }

  async putDeposito(id: number, body: any) {
    return await this.rootService.put(`${this.route}/${id}`, body);
  }

  async anularDeposito(id: number, body: any) {
    return await this.rootService.put(`${this.route}/anular/${id}`, body);
  }
  
  async deleteDeposito(id: number) {
    return await this.rootService.delete(`${this.route}/${id}`);
  }
}
