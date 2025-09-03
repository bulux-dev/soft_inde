import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class PresupuestosService {
  route: string = '/presupuestos'

  constructor( 
    private rootService: RootService
  ) { }
  async getPresupuestos(params: any = null) {
    return await this.rootService.get(this.route, params);
  }

  async getPresupuesto(id: number) {
    return await this.rootService.get(`${this.route}/${id}`);
  }

  async postPresupuesto(body: any) {
    return await this.rootService.post(this.route, body);
  }

  async putPresupuesto(id: number, body: any) {
    return await this.rootService.put(`${this.route}/${id}`, body);
  }

  async deletePresupuesto(id: number) {
    return await this.rootService.delete(`${this.route}/${id}`);
  }

}
