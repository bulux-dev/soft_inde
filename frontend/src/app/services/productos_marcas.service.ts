import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class ProductosMarcasService {

  route: string = '/productos_marcas';

  constructor(
    private rootService: RootService
  ) { }

  async getProductosMarcas(params: any = null) {
    return await this.rootService.get(this.route, params);
  }

  async getProductoMarca(id: number) {
    return await this.rootService.get(`${this.route}/${id}`);
  }

  async postProductoMarca(body: any) {
    return await this.rootService.post(this.route, body);
  }

  async putProductoMarca(id: number, body: any) {
    return await this.rootService.put(`${this.route}/${id}`, body);
  }

  async deleteProductoMarca(id: number) {
    return await this.rootService.delete(`${this.route}/${id}`);
  }

}
