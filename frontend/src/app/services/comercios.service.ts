import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class ComerciosService {

  route: string = '/comercios';

  constructor(
    private rootService: RootService
  ) { }

  async getComercios(params: any = null) {
    return await this.rootService.get(this.route, params);
  }

  async getComerciosArbol(params: any = null) {
    return await this.rootService.get(`${this.route}/arbol`, params);
  }

  async getComercio(id: number) {
    return await this.rootService.get(`${this.route}/${id}`);
  }

  async postComercio(body: any) {
    return await this.rootService.post(this.route, body);
  }

  async putComercio(id: number, body: any) {
    return await this.rootService.put(`${this.route}/${id}`, body);
  }

  async deleteComercio(id: number) {
    return await this.rootService.delete(`${this.route}/${id}`);
  }

}
