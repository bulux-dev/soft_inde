import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class ProductosAtributosService {

  route: string = '/productos_atributos';

  constructor(
    private rootService: RootService
  ) { }

  async getProductosAtributos(params: any = null) {
    return await this.rootService.get(this.route, params);
  }

  async getProductoAtributo(id: number) {
    return await this.rootService.get(`${this.route}/${id}`);
  }

  async postProductoAtributo(body: any) {
    return await this.rootService.post(this.route, body);
  }

  async putProductoAtributo(id: number, body: any) {
    return await this.rootService.put(`${this.route}/${id}`, body);
  }

  async deleteProductoAtributo(id: number) {
    return await this.rootService.delete(`${this.route}/${id}`);
  }

}
