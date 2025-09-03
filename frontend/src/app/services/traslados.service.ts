import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class TrasladosService {

  route: string = '/traslados';

  constructor(
    private rootService: RootService
  ) { }

  async getTraslados(fecha_inicio: any, fecha_fin: any, params: any = null) {
    return await this.rootService.get(`${this.route}/${fecha_inicio}/${fecha_fin}`, params);
  }

  async getTraslado(id: number) {
    return await this.rootService.get(`${this.route}/${id}`);
  }

  async postTraslado(body: any) {
    return await this.rootService.post(this.route, body);
  }

  async putTraslado(id: number, body: any) {
    return await this.rootService.put(`${this.route}/${id}`, body);
  }

  async anularTraslado(id: number, body: any) {
    return await this.rootService.put(`${this.route}/anular/${id}`, body);
  }

  async deleteTraslado(id: number) {
    return await this.rootService.delete(`${this.route}/${id}`);
  }
}
