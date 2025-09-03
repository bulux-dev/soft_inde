import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class ProductosPreciosService {

  route: string = '/productos_precios';

  constructor(
    private rootService: RootService
  ) { }

  async getProductosPrecios(params: any = null) {
    return await this.rootService.get(this.route, params);
  }

  async getProductoPrecio(id: number) {
    return await this.rootService.get(`${this.route}/${id}`);
  }

  async postProductoPrecio(body: any) {
    return await this.rootService.post(this.route, body);
  }

  async putProductoPrecio(id: number, body: any) {
    return await this.rootService.put(`${this.route}/${id}`, body);
  }

  async deleteProductoPrecio(id: number) {
    return await this.rootService.delete(`${this.route}/${id}`);
  }

}
