
import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class EtiquetasService {

  route: string = '/etiquetas';

  constructor(
    private rootService: RootService
  ) { }

  async getEtiquetas(params: any = null) {
    return await this.rootService.get(this.route, params);
  }

  async getEtiqueta(id: number) {
    return await this.rootService.get(`${this.route}/${id}`);
  }

  async postEtiqueta(body: any) {
    return await this.rootService.post(this.route, body);
  }

  async putEtiqueta(id: number, body: any) {
    return await this.rootService.put(`${this.route}/${id}`, body);
  }

  async deleteEtiqueta(id: number) {
    return await this.rootService.delete(`${this.route}/${id}`);
  }
}
