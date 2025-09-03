import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class NotasDebitosService {

  route: string = '/notas_debitos';

  constructor(
    private rootService: RootService
  ) { }

  async getNotasDebitos(fecha_inicio : any, fecha_fin: any, params: any = null) {
    return await this.rootService.get(`${this.route}/${fecha_inicio}/${fecha_fin}`, params);
  }

  async getNotaDebito(id: number) {
    return await this.rootService.get(`${this.route}/${id}`);
  }

  async postNotaDebito(body: any) {
    return await this.rootService.post(this.route, body);
  }

  async putNotaDebito(id: number, body: any) {
    return await this.rootService.put(`${this.route}/${id}`, body);
  }

  async anularNotaDebito(id: number, body: any) {
    return await this.rootService.put(`${this.route}/anular/${id}`, body);
  }
  
  async deleteNotaDebito(id: number) {
    return await this.rootService.delete(`${this.route}/${id}`);
  }
}
