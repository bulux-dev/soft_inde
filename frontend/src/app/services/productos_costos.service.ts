import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class ProductosCostosService {

  route: string = '/productos_costos';

  constructor(
    private rootService: RootService
  ) { }

  async getProductosCostos(params: any = null) {
    return await this.rootService.get(this.route, params);
  }

  async getProductoCosto(id: number) {
    return await this.rootService.get(`${this.route}/${id}`);
  }

  async postProductoCosto(body: any) {
    return await this.rootService.post(this.route, body);
  }

  async putProductoCosto(id: number, body: any) {
    return await this.rootService.put(`${this.route}/${id}`, body);
  }

  async deleteProductoCosto(id: number) {
    return await this.rootService.delete(`${this.route}/${id}`);
  }

}
