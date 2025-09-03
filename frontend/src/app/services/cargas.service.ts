import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class CargasService {

  route: string = '/cargas';

  constructor(
    private rootService: RootService
  ) { }

  async getCargas(fecha_inicio: any, fecha_fin: any, params: any = null) {
    return await this.rootService.get(`${this.route}/${fecha_inicio}/${fecha_fin}`, params);
  }

  async getCarga(id: number) {
    return await this.rootService.get(`${this.route}/${id}`);
  }

  async postCarga(body: any) {
    return await this.rootService.post(this.route, body);
  }

  async putCarga(id: number, body: any) {
    return await this.rootService.put(`${this.route}/${id}`, body);
  }

  async anularCarga(id: number, body: any) {
    return await this.rootService.put(`${this.route}/anular/${id}`, body);
  }

  async deleteCarga(id: number) {
    return await this.rootService.delete(`${this.route}/${id}`);
  }
}
