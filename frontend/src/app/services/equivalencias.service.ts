import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class EquivalenciasService {

  route: string = '/equivalencias';

  constructor(
    private rootService: RootService
  ) { }

  async getEquivalencias(params: any = null) {
    return await this.rootService.get(this.route, params);
  }

  async getEquivalencia(id: number) {
    return await this.rootService.get(`${this.route}/${id}`);
  }

  async postEquivalencia(body: any) {
    return await this.rootService.post(this.route, body);
  }

  async putEquivalencia(id: number, body: any) {
    return await this.rootService.put(`${this.route}/${id}`, body);
  }

  async deleteEquivalencia(id: number) {
    return await this.rootService.delete(`${this.route}/${id}`);
  }

}
