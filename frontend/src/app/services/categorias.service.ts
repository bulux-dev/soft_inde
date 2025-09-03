import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {

  route: string = '/categorias';

  constructor(
    private rootService: RootService
  ) { }

  async getCategorias(params: any = null) {
    return await this.rootService.get(this.route, params);
  }

  async getCategoriasBySucursal(sucursal_id: any, params: any = null) {
    return await this.rootService.get(this.route + '/sucursal/' + sucursal_id, params);
  }

  async getCategoria(id: number) {
    return await this.rootService.get(`${this.route}/${id}`);
  }

  async postCategoria(body: any) {
    return await this.rootService.post(this.route, body);
  }

  async putCategoria(id: number, body: any) {
    return await this.rootService.put(`${this.route}/${id}`, body);
  }

  async deleteCategoria(id: number) {
    return await this.rootService.delete(`${this.route}/${id}`);
  }
}
