import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class ImportacionesDetallesService {

  route: string = '/importaciones_detalles';

  constructor(
    private rootService: RootService
  ) { }

  async getImportacionesDetalles(params: any = null) {
    return await this.rootService.get(this.route, params);
  }

  async getImportacionDetalle(id: number) {
    return await this.rootService.get(`${this.route}/${id}`);
  }

  async postImportacionDetalle(body: any) {
    return await this.rootService.post(this.route, body);
  }

  async putImportacionDetalle(id: number, body: any) {
    return await this.rootService.put(`${this.route}/${id}`, body);
  }

  async deleteImportacionDetalle(id: number) {
    return await this.rootService.delete(`${this.route}/${id}`);
  }
}
