import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class NDProveedoresService {

  route: string = '/nd_proveedores';

  constructor(
    private rootService: RootService
  ) { }

  async getNDProveedores(fecha_inicio: any, fecha_fin: any, params: any = null) {
    return await this.rootService.get(`${this.route}/${fecha_inicio}/${fecha_fin}`, params);
  }

  async getNDProveedor(id: number) {
    return await this.rootService.get(`${this.route}/${id}`);
  }

  async postNDProveedor(body: any) {
    return await this.rootService.post(this.route, body);
  }

  async putNDProveedor(id: number, body: any) {
    return await this.rootService.put(`${this.route}/${id}`, body);
  }

  async anularNDProveedor(id: number, body: any) {
    return await this.rootService.put(`${this.route}/anular/${id}`, body);
  }
  
  async deleteNDProveedor(id: number) {
    return await this.rootService.delete(`${this.route}/${id}`);
  }
}
