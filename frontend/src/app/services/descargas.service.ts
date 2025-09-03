import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class DescargasService {

  route: string = '/descargas';

  constructor(
    private rootService: RootService
  ) { }

  async getDescargas(fecha_inicio: any, fecha_fin: any, params: any = null) {
    return await this.rootService.get(`${this.route}/${fecha_inicio}/${fecha_fin}`, params);
  }
  
  async getDescarga(id: number) {
    return await this.rootService.get(`${this.route}/${id}`);
  }

  async postDescarga(body: any) {
    return await this.rootService.post(this.route, body);
  }

  async putDescarga(id: number, body: any) {
    return await this.rootService.put(`${this.route}/${id}`, body);
  }

  async anularDescarga(id: number, body: any) {
    return await this.rootService.put(`${this.route}/anular/${id}`, body);
  }

  async deleteDescarga(id: number) {
    return await this.rootService.delete(`${this.route}/${id}`);
  }
}
