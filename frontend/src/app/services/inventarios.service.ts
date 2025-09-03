import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class InventariosService {

  route: string = '/inventarios';

  constructor(
    private rootService: RootService
  ) { }

  async getInventarios(params: any = null) {
    return await this.rootService.get(this.route, params);
  }

  async getInventario(id: number) {
    return await this.rootService.get(`${this.route}/${id}`);
  }

  async postInventario(body: any) {
    return await this.rootService.post(this.route, body);
  }

  async postCierreInventario(body: any) {
    return await this.rootService.post(this.route + '/cierre', body);
  }

  async putInventario(id: number, body: any) {
    return await this.rootService.put(`${this.route}/${id}`, body);
  }

  async deleteInventario(id: number) {
    return await this.rootService.delete(`${this.route}/${id}`);
  }

}
