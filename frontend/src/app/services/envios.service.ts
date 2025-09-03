import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class EnviosService {

  route: string = '/envios';

  constructor(
    private rootService: RootService
  ) { }

  async getEnvios(fecha_inicio: any, fecha_fin: any, params: any = null) {
    return await this.rootService.get(`${this.route}/${fecha_inicio}/${fecha_fin}`, params);
  }

  async getEnvio(id: number) {
    return await this.rootService.get(`${this.route}/${id}`);
  }

  async postEnvio(body: any) {
    return await this.rootService.post(this.route, body);
  }

  async putEnvio(id: number, body: any) {
    return await this.rootService.put(`${this.route}/${id}`, body);
  }

  async anularEnvio(id: number, body: any) {
    return await this.rootService.put(`${this.route}/anular/${id}`, body);
  }

  async deleteEnvio(id: number) {
    return await this.rootService.delete(`${this.route}/${id}`);
  }
}
