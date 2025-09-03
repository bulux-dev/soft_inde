import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class NotasCreditosService {

  route: string = '/notas_creditos';

  constructor(
    private rootService: RootService
  ) { }

  async getNotasCreditos(fecha_inicio: any, fecha_fin: any, params: any = null) {
    return await this.rootService.get(`${this.route}/${fecha_inicio}/${fecha_fin}`, params);
  }

  async getNotaCredito(id: number) {
    return await this.rootService.get(`${this.route}/${id}`);
  }

  async postNotaCredito(body: any) {
    return await this.rootService.post(this.route, body);
  }

  async putNotaCredito(id: number, body: any) {
    return await this.rootService.put(`${this.route}/${id}`, body);
  }

  async anularNotaCredito(id: number, body: any) {
    return await this.rootService.put(`${this.route}/anular/${id}`, body);
  }
  
  async deleteNotaCredito(id: number) {
    return await this.rootService.delete(`${this.route}/${id}`);
  }
}
