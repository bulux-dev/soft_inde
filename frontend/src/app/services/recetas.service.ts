import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class RecetasService {

  route: string = '/recetas';

  constructor(
    private rootService: RootService
  ) { }

  async getRecetas(params: any = null) {
    return await this.rootService.get(this.route, params);
  }

  async getReceta(id: number) {
    return await this.rootService.get(`${this.route}/${id}`);
  }

  async postReceta(body: any) {
    return await this.rootService.post(this.route, body);
  }

  async putReceta(id: number, body: any) {
    return await this.rootService.put(`${this.route}/${id}`, body);
  }

  async deleteReceta(id: number) {
    return await this.rootService.delete(`${this.route}/${id}`);
  }

}
