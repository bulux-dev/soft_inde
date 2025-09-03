import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class EstacionesService {

  route: string = '/estaciones';

  constructor(
    private rootService: RootService
  ) { }

  async getEstaciones(params: any = null) {
    return await this.rootService.get(this.route, params);
  }

  async getEstacion(id: number) {
    return await this.rootService.get(`${this.route}/${id}`);
  }

  async postEstacion(body: any) {
    return await this.rootService.post(this.route, body);
  }

  async putEstacion(id: number, body: any) {
    return await this.rootService.put(`${this.route}/${id}`, body);
  }

  async deleteEstacion(id: number) {
    return await this.rootService.delete(`${this.route}/${id}`);
  }

}
