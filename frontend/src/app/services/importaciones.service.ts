import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class ImportacionesService {

  route: string = '/importaciones';

  constructor(
    private rootService: RootService
  ) { }

  async getImportaciones(fecha_inicio: any, fecha_fin: any, params: any = null) {
    return await this.rootService.get(`${this.route}/${fecha_inicio}/${fecha_fin}`, params);
  }

  async getAllImportacionesSaldos(params: any = null) {
    return await this.rootService.get(`${this.route}/saldos`, params);
  }

  async getImportacion(id: number) {
    return await this.rootService.get(`${this.route}/${id}`);
  }

  async postImportacion(body: any) {
    return await this.rootService.post(this.route, body);
  }

  async putImportacion(id: number, body: any) {
    return await this.rootService.put(`${this.route}/${id}`, body);
  }

  async anularImportacion(id: number, body: any) {
    return await this.rootService.put(`${this.route}/anular/${id}`, body);
  }

  async deleteImportacion(id: number) {
    return await this.rootService.delete(`${this.route}/${id}`);
  }
}
