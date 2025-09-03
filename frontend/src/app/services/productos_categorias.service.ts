import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class ProductosCategoriasService {

  route: string = '/productos_categorias';

  constructor(
    private rootService: RootService
  ) { }

  async getProductosCategorias(params: any = null) {
    return await this.rootService.get(this.route, params);
  }

  async getProductoCategoria(id: number) {
    return await this.rootService.get(`${this.route}/${id}`);
  }

  async postProductoCategoria(body: any) {
    return await this.rootService.post(this.route, body);
  }

  async putProductoCategoria(id: number, body: any) {
    return await this.rootService.put(`${this.route}/${id}`, body);
  }

  async deleteProductoCategoria(id: number) {
    return await this.rootService.delete(`${this.route}/${id}`);
  }

}
