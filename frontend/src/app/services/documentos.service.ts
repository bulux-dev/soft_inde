import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class DocumentosService {

  route: string = '/documentos';

  constructor(
    private rootService: RootService
  ) { }

  async getDocumentos(params: any = null) {
    return await this.rootService.get(this.route, params);
  }

  async getDocumento(id: number) {
    return await this.rootService.get(`${this.route}/${id}`);
  }

  async postDocumento(body: any) {
    return await this.rootService.post(this.route, body);
  }

  async putDocumento(id: number, body: any) {
    return await this.rootService.put(`${this.route}/${id}`, body);
  }

  async deleteDocumento(id: number) {
    return await this.rootService.delete(`${this.route}/${id}`);
  }
}
