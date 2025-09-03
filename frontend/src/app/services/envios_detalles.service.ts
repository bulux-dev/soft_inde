import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class EnviosDetallesService {

  route: string = '/envios_detalles';

  constructor(
    private rootService: RootService
  ) { }

  async getEnviosDetalles(params: any = null) {
    return await this.rootService.get(this.route, params);
  }

  async getEnvioDetalle(id: number) {
    return await this.rootService.get(`${this.route}/${id}`);
  }

  async postEnvioDetalle(body: any) {
    return await this.rootService.post(this.route, body);
  }

  async putEnvioDetalle(id: number, body: any) {
    return await this.rootService.put(`${this.route}/${id}`, body);
  }

  async deleteEnvioDetalle(id: number) {
    return await this.rootService.delete(`${this.route}/${id}`);
  }
}
