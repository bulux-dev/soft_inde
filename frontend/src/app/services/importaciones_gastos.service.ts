import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class ImportacionesGastosService {

  route: string = '/importaciones_gastos';

  constructor(
    private rootService: RootService
  ) { }

  async getImportacionesGastos(params: any = null) {
    return await this.rootService.get(this.route, params);
  }

  async getImportacionGasto(id: number) {
    return await this.rootService.get(`${this.route}/${id}`);
  }

  async postImportacionGasto(body: any) {
    return await this.rootService.post(this.route, body);
  }

  async putImportacionGasto(id: number, body: any) {
    return await this.rootService.put(`${this.route}/${id}`, body);
  }

  async deleteImportacionGasto(id: number) {
    return await this.rootService.delete(`${this.route}/${id}`);
  }

}
