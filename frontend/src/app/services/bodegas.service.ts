import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class BodegasService {

  route: string = '/bodegas';

  constructor(
    private rootService: RootService
  ) { }

  async getBodegas(params: any = null) {
    return await this.rootService.get(this.route, params);
  }

  async getBodegasBySucursal(id: number) {
    return await this.rootService.get(`${this.route}/sucursal/${id}`);
  }

  async getBodega(id: number) {
    return await this.rootService.get(`${this.route}/${id}`);
  }

  async postBodega(body: any) {
    return await this.rootService.post(this.route, body);
  }

  async putBodega(id: number, body: any) {
    return await this.rootService.put(`${this.route}/${id}`, body);
  }

  async deleteBodega(id: number) {
    return await this.rootService.delete(`${this.route}/${id}`);
  }
}
