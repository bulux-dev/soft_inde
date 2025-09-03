import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class VariacionesService {

  route: string = '/variaciones';

  constructor(
    private rootService: RootService
  ) { }

  async getVariaciones(params: any = null) {
    return await this.rootService.get(this.route, params);
  }

  async getVariacion(id: number) {
    return await this.rootService.get(`${this.route}/${id}`);
  }

  async postVariacion(body: any) {
    return await this.rootService.post(this.route, body);
  }

  async postVariacionCombinaciones(body: any) {
    return await this.rootService.post(`${this.route}/combinaciones`, body);
  }

  async putVariacion(id: number, body: any) {
    return await this.rootService.put(`${this.route}/${id}`, body);
  }

  async deleteVariacion(id: number) {
    return await this.rootService.delete(`${this.route}/${id}`);
  }

}
