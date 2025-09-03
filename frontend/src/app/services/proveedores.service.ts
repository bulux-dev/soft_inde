import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class ProveedoresService {

  route: string = '/proveedores';

  constructor(
    private rootService: RootService
  ) { }

  async getProveedores(params: any = null) {
    return await this.rootService.get(this.route, params);
  }

  async getProveedor(id: number) {
    return await this.rootService.get(`${this.route}/${id}`);
  }

  async postProveedor(body: any) {
    return await this.rootService.post(this.route, body);
  }

  async putProveedor(id: number, body: any) {
    return await this.rootService.put(`${this.route}/${id}`, body);
  }

  async deleteProveedor(id: number) {
    return await this.rootService.delete(`${this.route}/${id}`);
  }

}
