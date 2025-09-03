import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class PartidasDetallesService {

  route: string = '/partidas_detalles';

  constructor(
    private rootService: RootService
  ) { }

  async getPartidasDetalles(params: any = null) {
    return await this.rootService.get(this.route, params);
  }

  async getPartidaDetalle(id: number) {
    return await this.rootService.get(`${this.route}/${id}`);
  }

  async postPartidaDetalle(body: any) {
    return await this.rootService.post(this.route, body);
  }

  async putPartidaDetalle(id: number, body: any) {
    return await this.rootService.put(`${this.route}/${id}`, body);
  }

  async deletePartidaDetalle(id: number) {
    return await this.rootService.delete(`${this.route}/${id}`);
  }
}
