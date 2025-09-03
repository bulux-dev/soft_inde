
import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class OperacionesEtiquetasService {

  route: string = '/operaciones_etiquetas';

  constructor(
    private rootService: RootService
  ) { }

  async getOperacionesEtiquetas(params: any = null) {
    return await this.rootService.get(this.route, params);
  }

  async getOperacionEtiqueta(id: number) {
    return await this.rootService.get(`${this.route}/${id}`);
  }

  async postOperacionEtiqueta(body: any) {
    return await this.rootService.post(this.route, body);
  }

  async putOperacionEtiqueta(id: number, body: any) {
    return await this.rootService.put(`${this.route}/${id}`, body);
  }

  async deleteOperacionEtiqueta(id: number) {
    return await this.rootService.delete(`${this.route}/${id}`);
  }
}
