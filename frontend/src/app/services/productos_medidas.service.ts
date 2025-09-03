import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class ProductosMedidasService {

  route: string = '/productos_medidas';

  constructor(
    private rootService: RootService
  ) { }

  async getProductosMedidas(params: any = null) {
    return await this.rootService.get(this.route, params);
  }

  async getProductoMedida(id: number) {
    return await this.rootService.get(`${this.route}/${id}`);
  }

  async postProductoMedida(body: any) {
    return await this.rootService.post(this.route, body);
  }

  async putProductoMedida(id: number, body: any) {
    return await this.rootService.put(`${this.route}/${id}`, body);
  }

  async deleteProductoMedida(id: number) {
    return await this.rootService.delete(`${this.route}/${id}`);
  }

}
