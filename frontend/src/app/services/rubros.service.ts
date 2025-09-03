import { Injectable } from '@angular/core';
import { RootService } from './root.service';
import { PresupuestosComponent } from '../admin/contabilidad/presupuestos/presupuestos.component';
import { PresupuestosService } from './presupuestos.service';



@Injectable({
  providedIn: 'root'
})
export class RubrosService {
  async getRubrosByPresupuestoId(presupuesto_id: any) {
    const params = { presupuesto_id }; 
    return await this.rootService.get(`${this.route}/presupuesto_id`, params);
  }
  async getPresupuesto(presupuesto_id: any) {
  //  return await this.rootService.get(`${this.presupuestoRoute}/${presupuesto_id}`);
  
  }

  route: string = '/rubros';
  
  constructor(
    private rootService: RootService
  ) { }

  
  async getRubros(params: any = null) {
    return await this.rootService.get(this.route, params);
  }
  async getRubrosJornalizacion(params: any = null) {
    const options = params ? { params } : {};
    return await this.rootService.get(`${this.route}/jornalizacion`, params);
  }
  async getRubro(id: number) {
    return await this.rootService.get(`${this.route}/${id}`);
  }

  async postRubro(body: any) {
    return await this.rootService.post(this.route, body);
  }

  async putRubro(id: number, body: any) {
    return await this.rootService.put(`${this.route}/${id}`, body);
  }

  async deleteRubro(id: number) {
    return await this.rootService.delete(`${this.route}/${id}`);
  }



}
