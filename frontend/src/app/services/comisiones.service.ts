import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class ComisionesService {

  route: string = '/comisiones';

  constructor(
    private rootService: RootService
  ) { }

  async getComisiones(params: any = null) {
    return await this.rootService.get(this.route, params);
  }

  async getComisionesRange(fecha_inicio: any, fecha_fin: any, params: any = null) {
    return await this.rootService.get(`${this.route}/range/${fecha_inicio}/${fecha_fin}`, params);
  }

  async getComision(id: number) {
    return await this.rootService.get(`${this.route}/${id}`);
  }

  async postComision(body: any) {
    return await this.rootService.post(this.route, body);
  }

  async putComision(id: number, body: any) {
    return await this.rootService.put(`${this.route}/${id}`, body);
  }
  
  async deleteComision(id: number) {
    return await this.rootService.delete(`${this.route}/${id}`);
  }
}
