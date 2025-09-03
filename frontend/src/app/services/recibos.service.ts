import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class RecibosService {

  route: string = '/recibos';

  constructor(
    private rootService: RootService
  ) { }

  async getRecibos(fecha_inicio: any, fecha_fin: any, params: any = null) {
    return await this.rootService.get(`${this.route}/${fecha_inicio}/${fecha_fin}`, params);
  }

  async getAllRecibosSaldos(params: any = null) {
    return await this.rootService.get(`${this.route}/saldos`, params);
  }

  async getRecibo(id: number) {
    return await this.rootService.get(`${this.route}/${id}`);
  }

  async postRecibo(body: any) {
    return await this.rootService.post(this.route, body);
  }

  async putRecibo(id: number, body: any) {
    return await this.rootService.put(`${this.route}/${id}`, body);
  }

  async anularRecibo(id: number, body: any) {
    return await this.rootService.put(`${this.route}/anular/${id}`, body);
  }

  async deleteRecibo(id: number) {
    return await this.rootService.delete(`${this.route}/${id}`);
  }
}
