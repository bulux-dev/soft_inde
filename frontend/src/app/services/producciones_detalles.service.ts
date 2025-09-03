import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class ProduccionesDetallesService {

  route: string = '/producciones_detalles';

  constructor(
    private rootService: RootService
  ) { }

  async getProduccionesDetalles(params: any = null) {
    return await this.rootService.get(this.route, params);
  }

  async getProduccionDetalle(id: number) {
    return await this.rootService.get(`${this.route}/${id}`);
  }

  async postProduccionDetalle(body: any) {
    return await this.rootService.post(this.route, body);
  }

  async putProduccionDetalle(id: number, body: any) {
    return await this.rootService.put(`${this.route}/${id}`, body);
  }

  async deleteProduccionDetalle(id: number) {
    return await this.rootService.delete(`${this.route}/${id}`);
  }
}
