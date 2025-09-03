import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class ComandasService {

  route: string = '/comandas';

  constructor(
    private rootService: RootService
  ) { }

  async getComandas(fecha_inicio: any, fecha_fin: any, params: any = null) {
    return await this.rootService.get(`${this.route}/${fecha_inicio}/${fecha_fin}`, params);
  }

  async getComandasDisplay(params: any = null) {
    return await this.rootService.get(`${this.route}/display`, params);
  }

  async getComanda(id: number) {
    return await this.rootService.get(`${this.route}/${id}`);
  }

  async postComanda(body: any) {
    return await this.rootService.post(this.route, body);
  }

  async putComanda(id: number, body: any) {
    return await this.rootService.put(`${this.route}/${id}`, body);
  }

  async anularComanda(id: number, body: any) {
    return await this.rootService.put(`${this.route}/anular/${id}`, body);
  }

  async deleteComanda(id: number) {
    return await this.rootService.delete(`${this.route}/${id}`);
  }
}
