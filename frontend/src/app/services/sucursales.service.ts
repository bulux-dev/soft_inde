import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class SucursalesService {

  route: string = '/sucursales';

  constructor(
    private rootService: RootService
  ) { }

  async getSucursales(params: any = null) {
    return await this.rootService.get(this.route, params);
  }

  async getSucursal(id: number) {
    return await this.rootService.get(`${this.route}/${id}`);
  }

  async postSucursal(body: any) {
    return await this.rootService.post(this.route, body);
  }

  async putSucursal(id: number, body: any) {
    return await this.rootService.put(`${this.route}/${id}`, body);
  }

  async deleteSucursal(id: number) {
    return await this.rootService.delete(`${this.route}/${id}`);
  }
}
