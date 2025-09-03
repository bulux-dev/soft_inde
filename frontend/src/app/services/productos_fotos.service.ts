import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class ProductosFotosService {

  route: string = '/productos_fotos';

  constructor(
    private rootService: RootService
  ) { }

  async getProductosFotos(params: any = null) {
    return await this.rootService.get(this.route, params);
  }

  async getProductoFoto(id: number) {
    return await this.rootService.get(`${this.route}/${id}`);
  }

  async postProductoFoto(body: any) {
    return await this.rootService.post(this.route, body);
  }

  async putProductoFoto(id: number, body: any) {
    return await this.rootService.put(`${this.route}/${id}`, body);
  }

  async deleteProductoFoto(id: number) {
    return await this.rootService.delete(`${this.route}/${id}`);
  }

}
