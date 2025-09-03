import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class TiposProductosService {

  route: string = '/tipos_productos';

  constructor(
    private rootService: RootService
  ) { }

  async getTiposProductos(params: any = null) {
    return await this.rootService.get(this.route, params);
  }

  async getTipoProducto(id: number) {
    return await this.rootService.get(`${this.route}/${id}`);
  }

  async postTipoProducto(body: any) {
    return await this.rootService.post(this.route, body);
  }

  async putTipoProducto(id: number, body: any) {
    return await this.rootService.put(`${this.route}/${id}`, body);
  }

  async deleteTipoProducto(id: number) {
    return await this.rootService.delete(`${this.route}/${id}`);
  }

}
